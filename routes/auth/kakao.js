const passport = require("passport");

exports.kakao = passport.authenticate("kakao");

exports.kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    {
      failureRedirect: "/api/auth/kakao/failure",
      //여기에 session:false옵션 없어도 되더라...
    },
    (authError, result) => {
      if (authError) {
        console.error(authError);

        return next(authError);
      }
      if (!result) {
        const script="<script type='text/javascript'>alert('이미 가입된 이메일입니다.');window.close();</script>"
        return res.send(script);
      }

      //여기에 session:false옵션이 있어야 세션-쿠키 방식을 사용하지 않는다.
      return req.login(result, { session: false }, (loginError) => {
        if (loginError) {
          console.error(loginError);

          return next(loginError);
        }

        const script="<script>window.opener.location.href='http://localhost:3000';window.close();</script>"
        return res
          .cookie("access_token", result.token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false,
            signed: true,
          })
          .send(script);
      });
    }
  )(req, res, next);
};
