const { Order, Detail, Food } = require("../../models");

module.exports=async(req, res, next)=>{
    try{
        const order=await Order.findAll({
            where:{
                orderId:req.params.orderId
            },
            attributes:{
                exclude:['tId', 'aId']
            },
            paranoid: false
        });
        if(order.length!==1){
            return res.status(400).end();
        }
        if(order[0].deletedAt){
            if(order[0].paid){
                return res.status(410).end();
            } else{
                return next((order[0].deli?'delivery':'pickup'));
            }
        }

        const details=await Detail.findAll({
            attributes:['num'],
            where:{
                orderId:order[0].id
            },
            include:{
                model:Food,
            }
        });

        return res.json({
            order:order[0],
            details
        });
    } catch(error){
        return next(error);
    }
}