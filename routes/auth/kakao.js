const passport = require("passport");

exports.kakao = passport.authenticate("kakao");

exports.kakaoCallback = passport.authenticate("kakao", {
  failureRedirect: "/",
});
