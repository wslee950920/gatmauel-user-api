const { Order, Detail, sequelize } = require("../../models");

module.exports=async(req, res, next)=>{
    const {phone, total, request, order, deli, address, detail, orderId}=req.session.payload;
    
    const t = await sequelize.transaction();
    try{
        const newOrder=await Order.create({
            orderId,
            customer:res.locals.user?
                res.locals.user.nick:
                ('비회원'+phone.slice(-4)),
            phone,
            total,
            deli,
            request,
            customerId:res.locals.user?res.locals.user.id:null,
            address,
            detail
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
        req.session.destroy();

        const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(newOrder.dataValues)}, 'http://localhost:3000');window.close();</script>`
        return res.send(script);
    } catch(err){
        await t.rollback();
        
        next(err);
    }
}