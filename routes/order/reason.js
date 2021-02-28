const { Order } = require("../../models");

module.exports=async(req, res, next)=>{
    try{
        const order=await Order.findAll({
            where:{
                orderId:req.params.orderId
            },
            paranoid: false
        });
        if(order.length!==1){
            return res.status(404).end();
        }

        if(order[0].deletedAt){
            return res.end();
        }
    } catch(error){
        return next(error);
    }
}