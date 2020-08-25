const joi = require("joi");
const bcrypt = require("bcrypt");

const { User } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    oldPassword: joi.string().max(100).required(),
    newPassword: joi.string().max(100).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { oldPassword, newPassword } = req.body;
  try {
    const exUser = await User.findByPk(req.user.id);
    if (exUser) {
      const result = await exUser.checkPassword(oldPassword);
      if (result) {
      } else {
        return res.status(401).send("잘못된 비밀번호입니다.");
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      const num = await exUser.update(
        { hashedPassword: hashed },
        { id: exUser.id }
      );
      if (num[0] == 0) {
        return res.status(404).send("조건에 맞는 유저를 찾을 수 없습니다.");
      } else if (num[0] > 1) {
        throw new Error(`${num[0]}개의 열이 수정됨`);
      }

      return res.redirect("/api/auth/logout");
    } else {
      return res.status(401).send("가입되지 않은 회원입니다.");
    }
  } catch (error) {
    console.error(error);

    return next(error);
  }
};
