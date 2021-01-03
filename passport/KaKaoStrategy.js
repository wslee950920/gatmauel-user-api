const KaKaoStrategy = require("passport-kakao").Strategy;

const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new KaKaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/api/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findBySns(profile.id, "kakao");
          if (exUser) {
            const token = exUser.generateToken(false);
            const data = exUser.serialize();

            done(null, { token, data });
          } else {
            const exEmail=await User.findByEmail(
              profile._json && profile._json.kakao_account.email
            );
            if(exEmail){
              return done(null, false);
            }
            
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account.email,
              nick: profile._json && profile._json.properties.nickname,
              snsId: profile.id,
              provider: "kakao",
            });
            const token = newUser.generateToken(false);
            const data = newUser.serialize();

            done(null, { token, data });
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
