const joi = require("joi");

const { User, Admin } = require("../../models");

exports.CheckNick = async (req, res, next) => {
  const schema = joi.object().keys({
    nick: joi.string().max(20).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { nick } = req.body;
  try {
    const exNick = await User.findByNick(nick, false);
    const exAdmin = await Admin.findByNick(nick, true);

    if (exNick||exAdmin) {
      return res.status(409).end();
    } else {
      return res.json(nick);
    }
  } catch (error) {
    return next(error);
  }
};

exports.Check = (req, res, next) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).end();
  } else {
    return res.json(user);
  }
};
