const { Order, Detail, sequelize } = require("../../models");

module.exports=async(req, res, next)=>{
    try{       
        req.session.destroy();
        
        const obj={
            success:res.locals.payload.orderId
        }
        const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`;
        return res.send(script);
    } catch(error){        
        const t = await sequelize.transaction();
        try{
            await Order.destroy({ 
                where: { id:res.locals.payload.id }, 
                transaction: t 
            });
            await Detail.destroy({
                where:{orderId:res.locals.payload.id}, 
                transaction:t
            });

            await t.commit();
        } catch(err){
            await t.rollback();

            next(err);
        }

        next(error);
    }
}