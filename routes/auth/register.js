const joi = require("joi");

const { User } = require("../../models");

const Register = async (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().email().max(40).required(),
    nick: joi.string().max(20).required(),
    password: joi.string().max(100).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { email, nick, password} = req.body;
  try {
    const exUser = await User.findByEmail(email, false);
    if (exUser) {
      return res.status(409).end();
    }

    const user = User.build({
      email,
      nick,
    });
    await user.setPassword(password);
    await user.save();

    return res.json(user.serialize());
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

module.exports = Register;
