const jwt = require("jsonwebtoken");
const { User } = require("../models");

const jwtMiddleware = async (req, res, next) => {
  const token = req.signedCookies.access_token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = { id: decoded.id, nick: decoded.nick };

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 5) {
      //const user = await User.findById(decoded.id); - deprecated
      const user = await User.findByPk(decoded.id);
      const token = user.generateToken();
      res.cookie("access_token", token, {
        //app.js에 세션id 쿠키 옵션과는 관련이 없다.
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: false,
        //req.signedCookies에서 봤을 땐 변화가 없지만 클라에서 보면 서명이 돼있다.
        singed: true,
      });
    }

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error(error);
      return res.status(419).send("토큰이 만료되었습니다.");
    } else {
      console.error(error);
      return res.status(401).send("유효하지 않은 토큰입니다.");
    }
  }
};

module.exports = jwtMiddleware;
