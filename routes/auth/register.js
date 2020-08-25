const joi = require("joi");

const { User } = require("../../models");

const Register = async (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().max(40).required(),
    nick: joi.string().max(20).required(),
    password: joi.string().max(100).required(),
    address: joi.string().max(100),
    phone: joi.string().max(11),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { email, nick, password, address, phone } = req.body;
  try {
    const exUser = await User.findByEmail(email);
    if (exUser) {
      return res.status(409).send("이미 가입된 이메일입니다.");
    }

    const user = User.build({
      email,
      nick,
      address,
      phone,
    });
    await user.setPassword(password);
    await user.save();

    const token = user.generateToken();
    return res
      .cookie("access_token", token, {
        //app.js에 세션id 쿠키 옵션과는 관련이 없다.
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: false,
        //req.signedCookies에서 봤을 땐 변화가 없지만 클라에서 보면 서명이 돼있다.
        signed: true,
      })
      .json(user.serialize());
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

module.exports = Register;
