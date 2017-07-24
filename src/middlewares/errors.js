const debug = require('debug')('app:middlewares:errors');
const env = require('../config/env');
const logger = require('../config/logger');

const NotFoundError = require('../errors/notFound');

const ErrorHandlerMiddleware = {

  notFound: (req, res, next) => {
    debug('route not found');

    next(new NotFoundError());
  },

  generic: (err, req, res, next) => {
    if (!err) return next();
    debug(`error caught: ${err.message}`);

    if (env.NODE_ENV !== 'development') delete err.stack;
    logger.error(err);

    if (err.name === 'ValidationError' && err.errors) {
      err.message = err.toString();
    }

    res
      .status(err.status || 500)
      .send({ error: err.message });
  },

};

module.exports = ErrorHandlerMiddleware;
