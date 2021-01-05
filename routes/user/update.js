const joi = require("joi");

const { User } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    nick: joi.string().max(20),
    address: joi.string().max(100),
    phone: joi.string().max(11),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    const num = await User.update(req.body, {
      where: { id: res.locals.user.id },
    });
    if (num[0] === 0) {
      return res.status(400).end();
    }
    
    const exUser=await User.findByNick(req.body.nick, true);
    if(!exUser){
      return res.status(404).end();
    }

    const user = exUser.serialize();
    const token=exUser.generateToken(false);
    return res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
      signed: true,
    }).json({
      user, 
      info:{
        email:exUser.email,
        address:exUser.address,
        phone:exUser.phone
       }
      });
  } catch (e) {
    console.error(e);

    next(e);
  }
};
