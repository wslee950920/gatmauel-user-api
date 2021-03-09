const axios=require('axios');

const { Detail, Food } = require("../../../models");
const {bizSignature}=require('../../../lib/ncpSignature');
const logger=require('../../../logger');

const method=(value)=>{
    if(value==='kakao'){
        return '카카오페이';
    } else if(value==='card'){
        return '카드결제';
    } else if(value==='later'){
        return '나중에결제';
    }
};
const makeContent=(orderId, orderDetail, request, address, phone, time, price, method, nickname)=>{
    return `주문번호 : ${orderId}\n주문내역 : \n${orderDetail}\n요청사항 : ${request}\n배달주소 : ${address}\n전화번호 : ${phone}\n주문시간 : ${time}\n결제금액 : ${price}원\n결제방법 : ${method}\n닉네임 : ${nickname}\n\n`
}
const orderTime=(time)=>{
    const temp=new Date(time);

    return `${temp.getHours()}시${temp.getMinutes()}분`
}

module.exports=async(req, res, next)=>{
    const {
        id, 
        orderId, 
        request, 
        address, 
        detail, 
        phone, 
        createdAt, 
        total, 
        customer, 
        deli,
        measure }=res.locals.payload;
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
            templateCode:"gatmauel10",
            messages:[{
                to:'01020770883',
                content:makeContent(
                    orderId, 
                    details.map((detail)=>{
                        return ` ${detail.food.name}x${detail.num}`
                    }).join(',\n'),
                    request,
                    (deli?address+', '+detail:'포장주문'),
                    phone,
                    orderTime(createdAt),
                    total,
                    method(measure),
                    customer,
                ),
                buttons:[{
                    type:'WL',
                    name:'주문정보 확인하기',
                    linkMobile:`https://www.gatmauel.com/result?orderId=${orderId}`,
                    linkPc:`https://www.gatmauel.com/result?orderId=${orderId}`,
                }]
            }]
        },{
            headers:{
                'Content-Type': 'application/json; charset=utf-8',
                'x-ncp-apigw-timestamp': Date.now().toString(),
                'x-ncp-iam-access-key': process.env.NAVER_ACCESS_KEY,
                'x-ncp-apigw-signature-v2': bizSignature().toString()
            },
        });

        await axios.post(`https://sens.apigw.ntruss.com/alimtalk/v2/services/${process.env.NAVER_BIZ_SERVICE_ID}/messages`,{
            plusFriendId:"@갯마을바지락칼국수보쌈",
            templateCode:"gatmauel10",
            messages:[{
                to:phone,
                content:makeContent(
                    orderId, 
                    details.map((detail)=>{
                        return ` ${detail.food.name}x${detail.num}`
                    }).join(',\n'),
                    request,
                    deli?address+', '+detail:'포장주문',
                    phone,
                    orderTime(createdAt),
                    total,
                    method(measure),
                    customer
                ),
                buttons:[{
                    type:'WL',
                    name:'주문정보 확인하기',
                    linkMobile:`https://www.gatmauel.com/result?orderId=${orderId}`,
                    linkPc:`https://www.gatmauel.com/result?orderId=${orderId}`,
                }]
            }],
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
        if(process.env.NODE_ENV==='production'){
            logger.error(error);
        }
           
        return res.redirect(`/@user/order/fail?orderId=${orderId}`);
    }
}