const express = require("express");
const joi = require("joi");
const passport = require("passport");

const { User } = require("../models");

const router = express.Router();

router.post("/register", async (req, res, next) => {
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
    const exUser = await User.findByEmail(email);
    if (exUser) {
      return res.status(409).send("이미 가입된 이메일입니다.");
    }

    const user = User.build({
      email,
      nick,
      name,
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
      })
      .json(user.serialize());
  } catch (error) {
    return next(error);
  }
});

router.post("/check/nick", async (req, res, next) => {
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
    return next(error);
  }
});

router.get("/check", (req, res, next) => {
  const user = req.app.get("state");

  if (!user) {
    return res.status(403).send("로그인이 필요합니다.");
  } else {
    return res.send(user);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    (authError, result, info) => {
      if (authError) {
        console.error(authError);

        return next(authError);
      }
      if (!result) {
        return res.status(401).send(info.message);
      }

      return req.login(result, { session: false }, (loginError) => {
        if (loginError) {
          console.log(loginError);

          return next(loginError);
        }

        return res
          .cookie("access_token", result.token, {
            //app.js에 세션id 쿠키 옵션과는 관련이 없다.
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: false,
          })
          .send(result.data);
      });
    }
  )(req, res, next);
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("access_token");
  res.status(204).end();
});

module.exports = router;
