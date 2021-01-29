const joi = require("joi");

const { Order, Detail, sequelize, User } = require("../../models");

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        phone:joi.string().max(11).required(),
        total:joi.number().required(),
        request:joi.string().required(),
        order:joi.array().items(joi.object({
            id:joi.number().required(),
            num:joi.number().required(),
        })),
        deli:joi.boolean().required(),
        address:joi.string().max(50).allow(''),
        detail:joi.string().max(50).allow(''),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const {phone, total, request, order, deli, address, detail}=req.body;

    const t = await sequelize.transaction();
    try{
        if(req.session.phone){
            if(req.session.phone!==phone){
                await t.rollback();

                return res.status(401).end();
            }
        } else{
            if(res.locals.user){
                const exUser=await User.findByPk(res.locals.user.id,{
                    transaction:t
                });
                if(!exUser.pVerified){
                    await t.rollback();

                    return res.status(403).end();
                }
            } else{
                await t.rollback();

                return res.status(401).end();
            }
        }

        const newOrder=await Order.create({
            customer:res.locals.user?
                res.locals.user.nick:
                (Date.now().toString().slice(-4)+phone.slice(-4)),
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
        const newDetail=await Promise.all(order.map((value)=>Detail.create({
            num:value.num,
            foodId:value.id,
            orderId:newOrder.id
        },{
            transaction:t
        })));

        await t.commit();
        req.session.destroy();

        return res.json({
            newOrder:{
                ...newOrder.dataValues,
                newDetail
            } 
        });
    } catch(err){
        await t.rollback();
        
        next(err);
    }
}