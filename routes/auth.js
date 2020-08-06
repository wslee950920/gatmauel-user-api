const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const joi = require("joi");

const router = express.Router();

router.post("/join", async (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().max(40).required(),
    nick: joi.string().max(20).required(),
    name: joi.string().max(20).required(),
    password: joi.string().max(100).required(),
    address: joi.string().max(100),
    phone: joi.string().max(11),
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

router.post("/nick", async (req, res, next) => {
  const schema = joi.object().keys({
    nick: joi.string().max(20).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { nick } = req.body;
  try {
    const exNick = await User.findOne({ where: { nick } });
    if (exNick) {
      return res.status(409).send("이미 사용 중 입니다.");
    } else {
      return res.send("사용 가능합니다.");
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
