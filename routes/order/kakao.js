const { Order } = require("../../models");
const logger=require('../../logger');

module.exports=async(req, res, next)=>{
    try{
        await Order.update({
            paid:true
        }, {
            where:{
                id:res.locals.payload.id
            }
        });

        req.session.destroy();
        
        return res.redirect(`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/result?orderId=${res.locals.payload.orderId}`);
    } catch(error){
        if(process.env.NODE_ENV==='production'){
            logger.error(error.message);
        }
        
        return res.redirect(`/@user/order/fail?orderId=${res.locals.payload.orderId}`)
    }
}