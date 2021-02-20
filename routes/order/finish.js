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
    try{       
        const details=await Detail.findAll({
            attributes:['num'],
            where:{
                orderId:res.locals.order.id
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
                    res.locals.order.orderId, 
                    details.map((detail)=>{
                        return ` ${detail.food.name}x${detail.num}`
                    }).join(',\n'),
                    res.locals.order.request,
                    res.locals.order.address?res.locals.order.address+', '+res.locals.order.detail:'포장주문',
                    res.locals.order.phone,
                    orderTime(res.locals.order.createdAt),
                    res.locals.order.total,
                    res.locals.order.customer
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


        if(req.params.measure==='later'){
            await Order.update({
                paid:true
            },{
                where:{
                    id:res.locals.order.id
                },
            })

            req.session.destroy();

            return res.json(res.locals.order);
        } else if(req.query.measure.toString()==='kakao'){
            req.session.destroy();
        
            const obj={
                success:res.locals.order
            }
            const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`;
            return res.send(script);
        }
    } catch(e){        
        const t = await sequelize.transaction();
        try{
            await Order.destroy({ 
                where: { id:res.locals.order.id }, 
                transaction: t 
            });
            await Detail.destroy({
                where:{orderId:res.locals.order.id}, 
                transaction:t
            });

            await t.commit();
        } catch(err){
            await t.rollback();

            next(err);
        }

        next(e);
    }
}