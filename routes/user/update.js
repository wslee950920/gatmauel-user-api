const joi = require("joi");
const jwt=require('jsonwebtoken');

const { User, sequelize, Review } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    nick: joi.string().max(20),
    address: joi.string().max(50).allow(''),
    detail:joi.string().max(50).allow(''),
    phone: joi.string().max(11).allow(''),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const t = await sequelize.transaction();
  try {
    const exUser = await User.findByPk(res.locals.user.id, {
      transaction:t
    });
    const prevNick=exUser.nick;

    const num = await User.update({
      ...req.body,
      pVerified:req.body.phone!==''?true:false
    }, {
      where: { id: res.locals.user.id },
      transaction: t
    });
    if (num[0] === 0) {
      await t.rollback();

      return res.status(400).end();
    }

    if(prevNick!==req.body.nick){
      await Review.update({nick:req.body.nick}, {
        where:{
          userId:res.locals.user.id
        },
        transaction:t
      });
    }

    await t.commit();

    const user = {id:res.locals.user.id, nick:req.body.nick};
    const prev = req.signedCookies.access_token;
    const decoded = jwt.verify(prev, process.env.JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);
    const token=jwt.sign(user, process.env.JWT_SECRET,{
      expiresIn:decoded.exp-now
    })
    return res.cookie('access_token', token, {
      maxAge: (decoded.exp-now)*1000,
      httpOnly: true,
      secure: false,
      signed: true,
    }).json({
      user, 
      info:{
        email:exUser.email,
        address:req.body.address,
        detail:req.body.detail,
        phone:req.body.phone
       }
      });
  } catch (e) {
    await t.rollback();

    next(e);
  }
};
