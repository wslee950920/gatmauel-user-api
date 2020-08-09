const KaKaoStrategy = require("passport-kakao").Strategy;

const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new KaKaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findBySns(profile.id, "kakao");
          if (exUser) {
            const token = exUser.generateToken();
            const data = exUser.serialize();

            done(null, { token, data });
          } else {
            const newUser = User.create({
              email: profile._json && profile._json.kaccount_email,
              nick: profile.displayName,
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
