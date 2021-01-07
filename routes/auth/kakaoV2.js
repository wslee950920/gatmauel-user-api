const joi = require("joi");

const { User } = require("../../models");

const kakaoV2= async (req, res, next)=>{
    const schema = joi.object().keys({
        id:joi.number().required(),
        email:joi.string().email().required(),
        nick:joi.string().required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const { email, nick, id } = req.body;
    try{
        const exUser = await User.findBySns(id, "kakao");
        if (exUser) {
            const token = exUser.generateToken(false);
            const data = exUser.serialize();

            return res
                .cookie("access_token", token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    secure: false,
                    signed: true,
                })
                .json(data);
        } else {
            const exEmail=await User.findByEmail(email, false);
            if(exEmail){
              return res.status(409).end();
            }
            
            const newUser = await User.create({
              email,
              nick,
              snsId: id,
              provider: "kakao",
              eVerified:true
            });
            const token = newUser.generateToken(false);
            const data = newUser.serialize();

            return res
                .cookie("access_token", token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    secure: false,
                    signed: true,
                })
                .json(data);
        }
    } catch (error) {
        console.error(error);
    
        return next(error);
    }
}

module.exports = kakaoV2;