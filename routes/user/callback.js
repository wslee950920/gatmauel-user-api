const joi=require('joi');

const {User} = require('../../models');

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        code: joi.string().max(6),
        phone:joi.string().max(11)
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
                phone:''
            }, {
                where: { id: res.locals.user.id }
            });
            if (num[0] === 0) {
                return res.status(400).end();
            }
            
            return res.status(419).end();
        }
        
        if(code===req.session.code){
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

            return res.end();
        } else{
            const num=await User.update({
                pVerified:false,
                phone:''
            }, {
                where: { id: res.locals.user.id }
            });
            if (num[0] === 0) {
                return res.status(400).end();
            }

            return res.status(404).end();
        }
    } catch(e){
        next(e);
    }
}