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
    return res.status(400).send(result.error);
  }

  try {
    const num = await User.update(req.body, {
      where: { id: res.locals.user.id },
    });
    if (num[0] == 0) {
      return res.status(404).send("조건에 맞는 유저를 찾을 수 없습니다.");
    } else if (num[0] > 1) {
      throw new Error(`${num[0]}개의 열이 수정됨`);
    }

    res.end();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
