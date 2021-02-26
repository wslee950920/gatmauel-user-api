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

        const result=await axios({
            method:'post',
            url:"https://kapi.kakao.com/v1/payment/order",
            headers:{
                'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            params:{
                cid:'TC0ONETIME',
                tid:order[0].tId
            }
        });
        
        if(result.data.status==='QUIT_PAYMENT'){
            await Order.destroy({ 
                where: { id:order[0].id }, 
                transaction: t 
            });
            await Detail.destroy({
                where:{orderId:order[0].id}, 
                transaction:t
            });

            await t.commit();
            
            const obj={
                cancel:'결제가 취소되었습니다.'
            }
            const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`
            return res.send(script);
        } else{
            throw new Error(result.data.status);
        }
    } catch(error){
        await t.rollback();

        if(process.env.NODE_ENV==='production'){
            logger.error(error.message);
        }

        setTimeout(()=>{
            return res.redirect(`/api/order/cancel?orderId=${req.query.orderId.toString()}`);
        }, 500);
    }
}