const { Order, Detail, sequelize } = require("../../models");


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

        next(e);
    }
}