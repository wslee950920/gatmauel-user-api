const joi=require('joi');

const { Order, Detail, Food } = require("../../models");

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        orderId:joi.string().max(10).required(),
    });
    const result = schema.validate(req.params);
    if (result.error) {
        return res.status(400).end();
    }

    try{
        const order=await Order.findOne({
            where:{
                orderId:req.params.orderId
            },
            attributes:{
                exclude:['tId', 'aId']
            },
            paranoid: false
        });
        if(!order){
            return res.status(404).end();
        }
        if(order.deletedAt){
            if(order.paid){
                return res.status(410).end();
            } else{
                return res.status(409).send((order.deli?'delivery':'pickup'));
            }
        }

        const details=await Detail.findAll({
            attributes:['num'],
            where:{
                orderId:order.id
            },
            include:{
                model:Food,
            }
        });

        return res.json({
            order,
            details
        });
    } catch(error){
        return next(error);
    }
}