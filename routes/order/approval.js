const axios=require('axios');

const { Order } = require("../../models");

module.exports=async(req, res, next)=>{
    try{
        const order=await Order.findAll({
            where:{
                orderId:req.query.orderId.toString()
            }
        });

        const result=await axios({
            method:'post',
            url:"https://kapi.kakao.com/v1/payment/approve",
            headers:{
                'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            params:{
                cid:'TC0ONETIME',
                tid:order[0].tId,
                partner_order_id:order[0].orderId,
                partner_user_id:res.locals.user?res.locals.user.nick:('gatmauel'+order[0].phone.slice(-4)),
                pg_token:req.query.pg_token.toString(),
            }
        });
        
        await Order.update({
            aId:result.data.aid,
        }, {
            where:{
                id:order[0].id
            }
        })

        res.locals.payload=order[0];

        return next();
    } catch(error){
        return res.redirect(`/api/order/fail?orderId=${req.query.orderId.toString()}`);
    }
}