const { Order } = require("../../models");

module.exports=async(req, res, next)=>{
    if(res.locals.user){
        try{
            const result=await Order.findAll({
                order: [["createdAt", "DESC"]],
                where:{
                    customerId:res.locals.user.id,
                    deli:true
                },
                attributes:['address', 'detail'],
                limit:1
            });
    
            return res.send(result);
        } catch(error){
            return next(error);
        }
    }
}   