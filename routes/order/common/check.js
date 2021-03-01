const joi=require('joi');

const { User } = require("../../../models");

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        orderId:joi.string().max(10).required(),
        phone:joi.string().max(11).required(),
        total:joi.number().required(),
        request:joi.string().required(),
        order:joi.array().items(joi.object({
            id:joi.number().required(),
            num:joi.number().required(),
            name:joi.string().required()
        })),
        deli:joi.boolean().required(),
        address:joi.string().max(50).allow(''),
        detail:joi.string().max(50).allow(''),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    if(req.session.phone){
        if(req.session.phone!==req.body.phone){
            return res.status(406).end();
        }
    } else{
        if(res.locals.user){
            const exUser=await User.findByPk(res.locals.user.id);
            if(!exUser.pVerified){
                return res.status(403).end();
            }
        } else{
            return res.status(401).end();
        }
    }

    return next();
}