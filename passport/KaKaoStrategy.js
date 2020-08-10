const KaKaoStrategy = require("passport-kakao").Strategy;

const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new KaKaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findBySns(profile.id, "kakao");
          if (exUser) {
            /*const token = exUser.generateToken();
            const data = exUser.serialize();

            done(null, { token, data });*/
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account.email,
              nick: profile._json && profile._json.properties.nickname,
              snsId: profile.id,
              provider: "kakao",
            });

            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
