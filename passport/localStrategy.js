const joi = require("joi");

const LocalStrategy = require("passport-local").Strategy;

const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        const schema = joi.object().keys({
          checked: joi.boolean().required(),
          email:joi.string().email().required(),
          password:joi.string().required()
        });
        const result = schema.validate(req.body);
        if (result.error) {
          done(result.error);
        }

        try {
          const exUser = await User.findByEmail(email);
          if (exUser) {
            const result = await exUser.checkPassword(password);
            if (result) {
              const token = exUser.generateToken();
              const data = exUser.serialize();

              done(null, { 
                token, 
                data, 
                maxAge:req.body.checked?
                  (1000 * 60 * 60 * 24 * 30):
                  (1000 * 60 * 60 * 24) 
                }
              );
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
