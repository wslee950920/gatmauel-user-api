const schedule = require("node-schedule");
const axios=require('axios');

const { Order, Detail, sequelize } = require("../../models");

module.exports=async(req, res, next)=>{
    const {phone, total, request, order, deli, address, detail, orderId, imp}=req.body;

    const t = await sequelize.transaction();
    try{
        const token=await axios.post('https://api.iamport.kr/users/getToken', {
                imp_key:process.env.IAMPORT_REST_API_KEY,
                imp_secret:process.env.IMAPORT_REST_API_SECRET
            }, {
                headers:{
                    "Content-Type":"application/json"
                }
            });
        
        const result=await axios.get(`https://api.iamport.kr/payments/${imp}`,{
            headers: {
                "Content-Type": "application/json", // "Content-Type": "application/json"
                "Authorization": `Bearer ${token.data.response.access_token}` // 발행된 액세스 토큰
              }
        });

        if(result.data.response.status==='paid'){
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
                tId:imp,
                measure:'card'
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
    
            res.locals.payload=newOrder;
    
            return next();
        } else{
            return next(result.response.status);
        }
    } catch(error){
        await t.rollback();

        return next(error);
    }
}