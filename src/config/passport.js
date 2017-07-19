const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

const AuthService = require('../services/v1/auth');

passport.use(new BearerStrategy((token, done) => {
  AuthService.authorize(token)
    .then(user => done(null, user, { scope: 'all' }))
    .catch(done);
}));

module.exports = passport;
