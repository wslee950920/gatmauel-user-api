const LocalStrategy = require("passport-local").Strategy;

const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findByEmail(email);
          if (exUser) {
            const result = await exUser.checkPassword(password);
            if (result) {
              const token = exUser.generateToken();
              const data = exUser.serialize();

              done(null, { token, data });
            } else {
              done(null, false);
            }
          } else {
            done(null, false);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
