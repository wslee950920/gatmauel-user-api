const axios=require('axios');
const joi=require('joi');

const { Order } = require("../../../models");
const logger=require('../../../logger');

module.exports=async(req, res, next)=>{
    const { imp_uid, merchant_uid } = req.query;
    try{
        const schema = joi.object().keys({
            merchant_uid:joi.string().length(10).required(),
            imp_uid:joi.string().max(20).required(),
            imp_success:joi.bool().required(),
            error_code:joi.string(),
            error_msg:joi.string()
        });
        const result = schema.validate(req.query);
        if (result.error) {
            throw new Error(result.error);
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

        const { amount, status, fail_reason } = paymentData;
        if(status==='paid'&&(amount===amountToBePaid)){
            await Order.update({tId:imp_uid}, {
                where:{
                    orderId:merchant_uid,
                },
            });
            return res.redirect(`https://www.gatmauel.com/result?orderId=${merchant_uid}`)
        } else if(status==='failed'){
            if(fail_reason.split(' | ')[1]==="사용자가 결제를 취소 하였습니다."){
                return res.redirect(`/@user/order/cancel?orderId=${merchant_uid}`)
            } else{
                return res.redirect(`/@user/order/fail?orderId=${merchant_uid}`)
            }
        } else{
            throw new Error(status);
        }
    } catch(error){
        if(process.env.NODE_ENV==='production'){
            logger.error(error);
        }

        return res.redirect(`/@user/order/fail?orderId=${merchant_uid}`);
    }
}