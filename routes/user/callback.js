const joi=require('joi');

const {User} = require('../../models');

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        code: joi.string().required(),
        phone:joi.string().max(11).required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const {code, phone}=req.body;
    try{
        if(!req.session.code){
            const num=await User.update({
                pVerified:false,
                phone:null
            }, {
                where: { id: res.locals.user.id }
            });
            if (num[0] === 0) {
                return res.status(400).end();
            }
            
            return res.status(419).end();
        }
        
        if(code===req.session.code){
            if(phone!==req.session.phone){
                return res.status(403).end();
            }
            
            const num=await User.update({
                pVerified:true,
                phone
            }, {
                where: { id: res.locals.user.id }
            });
            if (num[0] === 0) {
                return res.status(400).end();
            }

            delete req.session.code;
            delete req.session.phone;

            return res.end();
        } else{
            const num=await User.update({
                pVerified:false,
                phone:null
            }, {
                where: { id: res.locals.user.id }
            });
            if (num[0] === 0) {
                return res.status(400).end();
            }

            return res.status(404).end();
        }
    } catch(error){
        return next(error);
    }
}