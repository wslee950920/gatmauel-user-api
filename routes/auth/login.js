const passport = require("passport");

const Login = (req, res, next) => {
  passport.authenticate("local", (authError, result, info) => {
    if (authError) {
      console.error(authError);

      return next(authError);
    }
    if (!result) {
      return res.status(401).send(info.message);
    }

    return req.login(result, { session: false }, (loginError) => {
      if (loginError) {
        console.error(loginError);

        return next(loginError);
      }

      return res
        .cookie("access_token", result.token, {
          //app.js에 세션id 쿠키 옵션과는 관련이 없다.
          maxAge: 1000 * 60 * 15,
          httpOnly: true,
          secure: false,
          //req.signedCookies에서 봤을 땐 변화가 없지만 클라에서 보면 서명이 돼있다.
          signed: true,
        })
        .json(result.data);
    });
  })(req, res, next);
};

module.exports = Login;
