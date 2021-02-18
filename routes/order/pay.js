const joi = require("joi");
const crypto=require('crypto');
const schedule = require("node-schedule");

const { User, Order, Detail, sequelize } = require("../../models");

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
    const {phone, total, request, order, deli, address, detail}=req.body;

    if(req.session.phone){
        if(req.session.phone!==phone){
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

    const t = await sequelize.transaction();
    try{
        const orderId=await crypto.randomBytes(5).toString('hex').toUpperCase();
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

        if(req.params.measure==='kakao'){
            res.locals.payload={
                ...req.body,
                orderId,
            };

            return next();
        } else if(req.params.measure==='later'){
            res.locals.order=newOrder;
            
            return next();
        }

        await t.commit();

        return next(req.params.measure.toString());
    } catch(e){
        await t.rollback();

        next(e);
    }
}