const axios=require('axios');

const { Order, Detail, sequelize } = require("../../models");
const logger=require('../../logger');

module.exports=async(req, res, next)=>{
    const t = await sequelize.transaction();
    try{
        const order=await Order.findAll({
            where:{
                orderId:req.query.orderId.toString()
            }
        });

        await Order.destroy({ 
            where: { id:order[0].id }, 
            transaction: t 
        });
        await Detail.destroy({
            where:{orderId:order[0].id}, 
            transaction:t
        });

        if(order[0].measure==='kakao'){
            await axios({
                method:'post',
                url:"https://kapi.kakao.com/v1/payment/cancel",
                headers:{
                    'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                params:{
                    cid:'TC0ONETIME',
                    tid:order[0].tId,
                    cancel_amount:order[0].total,
                    cancel_tax_free_amount:0
                }
            });

            await t.commit();

            const obj={
                fail:'결제를 실패하였습니다. 잠시 후 다시 시도해주십시오.'
            }
            const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`
            return res.send(script);
        } else if(order[0].measure==='later'){
            await t.commit();
            return res.status(500).send(order[0].measure);
        } else if(order[0].measure==='card'){
            const token=await axios.post('https://api.iamport.kr/users/getToken', {
                imp_key:process.env.IAMPORT_REST_API_KEY,
                imp_secret:process.env.IMAPORT_REST_API_SECRET
            }, {
                headers:{
                    "Content-Type":"application/json"
                }
            });

            await axois.post('https://api.iamport.kr/payments/cancel',{
                imp_uid:order[0].tId,
                merchant_uid:order[0].orderId,
                checksum:null,
                reason:'결제 프로세스 실패',
            }, {
                headers: {
                    "Content-Type": "application/json", // "Content-Type": "application/json"
                    "Authorization": `Bearer ${token.data.response.access_token}` // 발행된 액세스 토큰
                }
            });

            await t.commit();
            return res.status(500).send(order[0].measure);
        }
    } catch(error){
        await t.rollback();

        if(process.env.NODE_ENV==='production'){
            logger.error(error.message);
          }

        setTimeout(()=>{
            return res.redirect(`/api/order/fail?orderId=${req.query.orderId.toString()}`);
        }, 500);
    }
}