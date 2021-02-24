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
        const user=await User.findAll({
            where:{
                nick:nickname,
                phone
            }
        });
        if(user.length!==1){
            return res.status(404).end();
        }

        const index=user[0].email.indexOf('@');
        return res.json({email:user[0].email.substr(0, index-3)+'***'+user[0].email.substr(index, user[0].email.length)});
    } catch(error){
        return next(error);
    }
}