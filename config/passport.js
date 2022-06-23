const passport = require('passport');
const { User } = require('../models/index');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    const user = await User.findOne({ where: { id: jwt_payload.id } });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);
