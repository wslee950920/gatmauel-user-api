const axios=require('axios');

const { Order, Detail, Food, sequelize } = require("../../models");
const {bizSignature}=require('../../lib/ncpSignature');

const makeContent=(orderId, orderDetail, request, address, phone, time, price, nickname)=>{
    return `주문번호 : ${orderId}\n주문내역 : \n${orderDetail}\n요청사항 : ${request}\n배달주소 : ${address}\n전화번호 : ${phone}\n주문시간 : ${time}\n결제금액 : ${price}원\n닉네임 : ${nickname}`
}
const orderTime=(time)=>{
    const temp=new Date(time);

    return `${temp.getHours()}시${temp.getMinutes()}분`
}

module.exports=async(req, res, next)=>{
    const {id, orderId, request, address, detail, phone, createdAt, total, customer }=res.locals.payload;
    try{       
        const details=await Detail.findAll({
            attributes:['num'],
            where:{
                orderId:id
            },
            include:{
                model:Food,
                attributes:['name']
            }
        })

        await axios.post(`https://sens.apigw.ntruss.com/alimtalk/v2/services/${process.env.NAVER_BIZ_SERVICE_ID}/messages`,{
            plusFriendId:"@갯마을바지락칼국수보쌈",
            templateCode:"AlimTalk",
            messages:[{
                to:'01020770883',
                content:makeContent(
                    orderId, 
                    details.map((detail)=>{
                        return ` ${detail.food.name}x${detail.num}`
                    }).join(',\n'),
                    request,
                    address?address+', '+detail:'포장주문',
                    phone,
                    orderTime(createdAt),
                    total,
                    customer
                )
            }]
        },{
            headers:{
                'Content-Type': 'application/json; charset=utf-8',
                'x-ncp-apigw-timestamp': Date.now().toString(),
                'x-ncp-iam-access-key': process.env.NAVER_ACCESS_KEY,
                'x-ncp-apigw-signature-v2': bizSignature().toString()
            },
        })

        return next();
    } catch(error){        
        const t = await sequelize.transaction();
        try{
            await Order.destroy({ 
                where: { id }, 
                transaction: t 
            });
            await Detail.destroy({
                where:{orderId:id}, 
                transaction:t
            });

            await t.commit();
        } catch(err){
            await t.rollback();

            next(err);
        }

        next(error);
    }
}