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
                where:{
                    id:order[0].id
                },
            })
            
            const obj={
                cancel:'결제가 취소되었습니다.'
            }
            const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`
            return res.send(script);
        }
    } catch(err){
        next(err);
    }
}