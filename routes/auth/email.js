const joi = require("joi");

const { User } = require("../../models");

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        nickname: joi.string().max(20).required(),
        phone:joi.string().max(11).required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const {nickname, phone}=req.body;
    try{
        const user=await User.findOne({
            where:{
                nick:nickname,
                phone
            }
        });
        if(!user){
            return res.status(404).end();
        }

        const index=user.email.indexOf('@');
        return res.json({email:user.email.substr(0, index-3)+'***'+user.email.substr(index, user.email.length)});
    } catch(error){
        return next(error);
    }
}