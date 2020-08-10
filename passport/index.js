const local = require("./localStrategy");
const kakao = require("./KaKaoStrategy");
const { User } = require("../models");

module.exports = (passport) => {
  /*passport.serializeUser((user, done) => {
    console.log("serialize");

    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    console.log("deserialize");

    User.findByPk(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });*/

  local(passport);
  kakao(passport);
};
