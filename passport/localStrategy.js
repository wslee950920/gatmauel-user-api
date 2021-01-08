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
          email:joi.string().email().max(40).required(),
          password:joi.string().required()
        });
        const result = schema.validate(req.body);
        if (result.error) {
          return done(result.error);
        }

        try {
          const exUser = await User.findByEmail(email, true);
          if (exUser) {
            if(exUser.provider!=='local'){
              const err = new Error();
              err.status = 409;

              return done(err);
            }
            if(!exUser.eVerified){
              const err=new Error();
              err.status=403;

              return done(err);
            }

            const result = await exUser.checkPassword(password);
            if (result) {
              const token = exUser.generateToken(req.body.checked);
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
          done(error);
        }
      }
    )
  );
};
