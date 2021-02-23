const { Order } = require("../../models");

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
        const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`;
        return res.send(script);
    } catch(error){
        return res.redirect(`/api/order/fail?orderId=${res.locals.payload.orderId}`)
    }
}