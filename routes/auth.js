const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const joi = require("joi");

const router = express.Router();

router.post("/join", async (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().required(),
    nick: joi.string().required(),
    name: joi.string().required(),
    password: joi.string().required(),
    address: joi.string(),
    phone: joi.string(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { email, nick, name, password, address, phone } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(409).send("이미 가입된 이메일입니다.");
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      nick,
      password: hash,
      name,
      address,
      phone,
    });
    const data = { id: user.id, nick: user.nick };

    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
