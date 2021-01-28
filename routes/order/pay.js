const joi = require("joi");

const { Order, Detail } = require("../../models");

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        phone:joi.string().max(11).required(),
        total:joi.number().required(),
        request:joi.string().required(),
        order:joi.array().items(joi.object({
            id:joi.number().required(),
            num:joi.number().required(),
        })),
        deli:joi.boolean().required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const {phone, total, request, order, deli}=req.body;
    try{
        const newOrder=await Order.create({
            customer:res.locals.user?res.locals.user.nick:(phone.slice(-4)+Date.now().toString().slice(-4)),
            phone,
            total,
            deli,
            request,
            customerId:res.locals.user?res.locals.user.id:null
        });
        const result=await Promise.all(order.map((value)=>Detail.create({
            num:value.num,
            foodId:value.id,
            orderId:newOrder.id
        })));

        return res.json({newOrder, result});
    } catch(err){
        next(err);
    }
}