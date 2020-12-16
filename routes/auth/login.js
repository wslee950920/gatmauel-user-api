const passport = require("passport");

const Login = (req, res, next) => {
  //athenticate 두번째 파라미터로 {session:false}옵션을 넣으면 오류 나더라
  passport.authenticate("local", (authError, result) => {
    if (authError) {
      console.error(authError);

      return next(authError);
    }
    if (!result) {
      return res.status(401).end();
    }

    return req.login(result, { session: false }, (loginError) => {
      if (loginError) {
        console.error(loginError);

        return next(loginError);
      }

      return res
        .cookie("access_token", result.token, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          secure: false,
          signed: true,
        })
        .json(result.data);
    });
  })(req, res, next);
};

module.exports = Login;
