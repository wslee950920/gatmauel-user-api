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
        
        const obj={
            success:res.locals.payload.orderId
        }
        const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}');window.close();</script>`;
        return res.send(script);
    } catch(error){
        if(process.env.NODE_ENV==='production'){
            logger.error(error.message);
          }
        
        return res.redirect(`/api/order/fail?orderId=${res.locals.payload.orderId}`)
    }
}