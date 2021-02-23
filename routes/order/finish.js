const { Order } = require("../../models");


module.exports=async(req, res, next)=>{
    try{    
        req.session.destroy();

        await Order.update({
            paid:true
        }, {
            where:{
                id:res.locals.payload.id
            }
        })

        return res.json({orderId:res.locals.payload.orderId});
    } catch(e){        
        return res.redirect(`/api/order/fail?orderId=${res.locals.payload.orderId}`)
    }
}