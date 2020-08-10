const passport = require("passport");

exports.kakao = passport.authenticate("kakao");

exports.kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    {
      failureRedirect: "/",
      //여기에 session:false옵션 없어도 되더라...
    },
    (authError, result) => {
      if (authError) {
        console.error(authError);

        return next(authError);
      }
      if (!result) {
        res.status(401).send(result);
      }

      //여기에 session:false옵션이 있어야 세션-쿠키 방식을 사용하지 않는다.
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
          .send(result.data);
      });
    }
  )(req, res, next);
};
