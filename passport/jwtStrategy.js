const JwtStrategy = require('passport-jwt').Strategy,
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt=require('bcrypt');

const {User}=require('../models');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports=(passport)=>{
    passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    }));
};