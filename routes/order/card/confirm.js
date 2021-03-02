const axios=require('axios');
const joi=require('joi');

const { Order } = require("../../../models");
const logger=require('../../../logger');

module.exports=async(req, res, next)=>{
    const { imp_uid, merchant_uid } = req.body;
    try{
        const schema = joi.object().keys({
            merchant_uid:joi.string().length(10).required(),
            imp_uid:joi.string().max(20).required(),
            status:joi.string().max(10).required()
        });
        const result = schema.validate(req.body);
        if (result.error) {
            return res.status(400).end();
        }
        
        const getToken=await axios.post('https://api.iamport.kr/users/getToken', {
                imp_key:process.env.IAMPORT_REST_API_KEY,
                imp_secret:process.env.IMAPORT_REST_API_SECRET
            }, {
                headers:{
                    "Content-Type":"application/json"
                }
            });
        const {access_token}=getToken.data.response;
        
        const getPaymentData=await axios.get(`https://api.iamport.kr/payments/${imp_uid}`,{
            headers: {
                "Content-Type": "application/json", // "Content-Type": "application/json"
                "Authorization": `Bearer ${access_token}` // 발행된 액세스 토큰
              }
        });
        const paymentData = getPaymentData.data.response;

        const order=await Order.findAll({
            where:{
                orderId:merchant_uid
            }
        });
        const amountToBePaid = order[0].total; // 결제 되어야 하는 금액

        const { amount, status } = paymentData;
        if(status==='paid'&&(amount===amountToBePaid)){
            await Order.update({tId:imp_uid}, {
                where:{
                    orderId:merchant_uid,
                },
            });
    
            res.locals.payload=order[0];
    
            return next();
        } else if(status==='cancelled'){
            return res.redirect(`/@user/order/cancel?orderId=${merchant_uid}`);
        }
    } catch(error){
        if(process.env.NODE_ENV==='production'){
            logger.error(error);
        }

        return res.redirect(`/@user/order/fail?orderId=${merchant_uid}`);
    }
}