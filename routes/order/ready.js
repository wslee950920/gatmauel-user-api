const schedule = require("node-schedule");
const axios=require('axios');

const { Order, Detail, sequelize } = require("../../models");

module.exports=async(req, res, next)=>{
    const {phone, total, request, order, deli, address, detail, orderId}=req.body;

    const t = await sequelize.transaction();
    try{
        const newOrder=await Order.create({
            orderId,
            customer:res.locals.user?res.locals.user.nick:('gatmauel'+phone.slice(-4)),
            phone,
            total,
            deli,
            request,
            customerId:res.locals.user?res.locals.user.id:null,
            address,
            detail,
            measure:'kakao'
        },{
            transaction:t
        });
        await Promise.all(order.map((value)=>Detail.create({
            num:value.num,
            foodId:value.id,
            orderId:newOrder.id
        },{
            transaction:t
        })));

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
                approval_url:`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/@user/order/approval?orderId=${orderId}`,
                cancel_url:`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/@user/order/cancel?orderId=${orderId}`,
                fail_url:`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/@user/order/fail?orderId=${orderId}`
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
                transaction:t
            }
        );
            
        await t.commit();

        const end = new Date();
        end.setDate(end.getDate() + 3);
        schedule.scheduleJob(end, () => {
            Order.destroy({ 
                where: { 
                    id:newOrder.id,
                    paid:false 
                },  
            });
        });

        return res.json({result:result.data});
    } catch(error){
        await t.rollback();

        return next(error);
    }
}