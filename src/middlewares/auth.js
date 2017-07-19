const debug = require('debug')('app:middlewares:auth');

const UnauthorizedError = require('../errors/unauthorized');
const config = require('../config');

const AuthMiddleware = {

  isAuthenticated: (req, res, next) => {
    debug('verifying auth');

    if (req.isAuthenticated()) return next();
    config.passport.authenticate(['bearer'], { session: false })(req, res, next);
  },

  isAdmin: (req, res, next) => {
    debug('verifying if user is admin');

    const { user } = req;

    if (user && user.isAdmin) return next();

    next(new UnauthorizedError('Current action can only be performed by an administrator'));
  },

};

module.exports = AuthMiddleware;
