const { Order, Detail, Food } = require("../../models");

module.exports=async(req, res, next)=>{
    try{
        const order=await Order.findAll({
            where:{
                orderId:req.params.orderId
            }
        });
        if(order.length!==1){
            return res.status(400).end();
        }

        const details=await Detail.findAll({
            attributes:['num'],
            where:{
                orderId:order[0].id
            },
            include:{
                model:Food,
            }
        })

        return res.json({
            order:order[0],
            details
        });
    } catch(err){
        next(err);
    }
}