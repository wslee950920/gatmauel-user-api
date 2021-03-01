const { Order } = require("../../models");
const logger=require('../../logger');

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

        return res.end();
    } catch(error){        
        if(process.env.NODE_ENV==='production'){
            logger.error(error.message);
          }
        
        return res.redirect(`/@user/order/fail?orderId=${res.locals.payload.orderId}`)
    }
}