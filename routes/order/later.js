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

        res.locals.payload=newOrder;

        await t.commit();
        return next();
    } catch(error){
        await t.rollback();

        return next(error);
    }
}