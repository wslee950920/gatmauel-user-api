const schedule = require("node-schedule");

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
            measure:'later'
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
    } catch(error){
        await t.rollback();

        next(error);
    }
}