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
    return res.status(400).end();
  }

  const { oldPassword, newPassword } = req.body;
  try {
    const exUser = await User.findByPk(res.locals.user.id);
    if (exUser) {
      const result = await exUser.checkPassword(oldPassword);
      if (result) {
      } else {
        return res.status(401).end();
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      const num = await exUser.update(
        { hashedPassword: hashed },
        { id: exUser.id }
      );
      if (num[0] == 0) {
        return res.status(404).end();
      }

      return res.redirect("/api/auth/logout");
    } else {
      return res.status(401).end();
    }
  } catch (error) {
    console.error(error);

    return next(error);
  }
};
