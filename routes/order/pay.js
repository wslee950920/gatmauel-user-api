const joi = require("joi");
const axios=require('axios');
const crypto=require('crypto');

const { User } = require("../../models");

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        phone:joi.string().max(11).required(),
        total:joi.number().required(),
        request:joi.string().required(),
        order:joi.array().items(joi.object({
            id:joi.number().required(),
            num:joi.number().required(),
            name:joi.string().required()
        })),
        deli:joi.boolean().required(),
        address:joi.string().max(50).allow(''),
        detail:joi.string().max(50).allow(''),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    if(req.session.phone){
        if(req.session.phone!==req.body.phone){
            return res.status(406).end();
        }
    } else{
        if(res.locals.user){
            const exUser=await User.findByPk(res.locals.user.id);
            if(!exUser.pVerified){
                return res.status(403).end();
            }
        } else{
            return res.status(401).end();
        }
    }

    try{
        if(req.query.measure.toString()==='kakao'){
            const {order, total}=req.body;
            const orderId=await crypto.randomBytes(5).toString('hex');
    
            const result=await axios({
                url:"https://kapi.kakao.com/v1/payment/ready",
                method:'post',
                params:{
                    cid:'TC0ONETIME',
                    partner_order_id:orderId,
                    partner_user_id:'gatmauel9300',
                    item_name:`${order[0].name}`+(order.length>1?` 외 ${order.length-1}`:''),
                    quantity:order.length,
                    total_amount:total,
                    tax_free_amount:0,
                    approval_url:'http://localhost:9090/api/order/approval',
                    cancel_url:'http://localhost:9090/api/order/cancel',
                    fail_url:'http://localhost:9090/api/order/fail'
                },
                headers:{
                    'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })

            req.session.payload={
                ...req.body,
                orderId,
                tid:result.data.tid
            };
            
            return res.json({result:result.data});
        }
    } catch(e){
        next(e);
    }
}