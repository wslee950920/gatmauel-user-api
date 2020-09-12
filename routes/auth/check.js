const joi = require("joi");

const { User } = require("../../models");

exports.CheckNick = async (req, res, next) => {
  const schema = joi.object().keys({
    nick: joi.string().max(20).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { nick } = req.body;
  try {
    const exNick = await User.findByNick(nick);
    if (exNick) {
      return res.status(409).send("이미 사용 중 입니다.");
    } else {
      return res.send("사용 가능합니다.");
    }
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

exports.Check = (req, res, next) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send("로그인이 필요합니다.");
  } else {
    return res.json(user);
  }
};
