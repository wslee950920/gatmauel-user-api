const axios=require('axios');

const { Order } = require("../../models");

module.exports=async(req, res, next)=>{
    const {orderId, order, total, phone}=res.locals.payload;
    try{
        const result=await axios({
            url:"https://kapi.kakao.com/v1/payment/ready",
            method:'post',
            params:{
                cid:'TC0ONETIME',
                partner_order_id:orderId,
                partner_user_id:res.locals.user?res.locals.user.nick:('gatmauel'+phone.slice(-4)),
                item_name:`${order[0].name}`+(order.length>1?` 외 ${order.length-1}`:''),
                quantity:order.length,
                total_amount:total,
                tax_free_amount:0,
                approval_url:`http://localhost:9090/api/order/approval?orderId=${orderId}&measure=kakao`,
                cancel_url:`http://localhost:9090/api/order/cancel?orderId=${orderId}`,
                fail_url:`http://localhost:9090/api/order/fail?orderId=${orderId}`
            },
            headers:{
                'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
        
        await Order.update(
            {
                tId:result.data.tid
            }, {
                where:{
                    orderId,
                },
            }
        );
            
        return res.json({result:result.data});
    } catch(e){
        next(e);
    }
}