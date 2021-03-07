const axios=require('axios');
const joi=require('joi');

const { Order } = require("../../../models");
const logger=require('../../../logger');

module.exports=async(req, res, next)=>{
    const {orderId, pg_token}=req.query;
    try{
        const schema = joi.object().keys({
            orderId:joi.string().length(10).required(),
            pg_token:joi.string().required(),
        });
        const verify = schema.validate(req.query);
        if (verify.error) {
            throw new Error(verify.error); 
        }

        const order=await Order.findOne({
            where:{
                orderId
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
                tid:order.tId,
                partner_order_id:order.orderId,
                partner_user_id:res.locals.user?res.locals.user.nick:('gatmauel'+order.phone.slice(-4)),
                pg_token
            }
        });
        
        await Order.update({
            aId:result.data.aid,
        }, {
            where:{
                id:order.id
            }
        })
        
        res.locals.payload=order;

        return next();
    } catch(error){
        if(process.env.NODE_ENV==='production'){
            logger.error(error);
        }
        
        return res.redirect(`/@user/order/fail?orderId=${orderId}`);
    }
}