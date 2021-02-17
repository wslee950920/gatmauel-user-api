const { Order } = require("../../models");

module.exports=async(req, res, next)=>{
    try{       
        if(req.params.measure==='later'){
            await Order.update({
                paid:true
            },{
                where:{
                    id:res.locals.order.id
                },
            })

            req.session.destroy();

            return res.json(res.locals.order);
        } else if(req.query.measure.toString()==='kakao'){
            req.session.destroy();
        
            const obj={
                success:res.locals.order
            }
            const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`;
            return res.send(script);
        }
    } catch(err){        
        next(err);
    }
}