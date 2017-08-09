const debug = require('debug')('app:config:mongoose');
const mongoose = require('mongoose');
const logger = require('./logger');
const env = require('./env');
const User = require('../models/v1/user');

const url = env.MONGO_DB;

debug(`configuring mongoose connection to ${url}`);

mongoose.Promise = Promise;

mongoose.set('debug', env.NODE_ENV !== 'production');

module.exports = new Promise((resolve, reject) => {
  mongoose.connect(url, { reconnectTries: Number.MAX_VALUE, useMongoClient: true });

  mongoose.connection.on('connected', () => logger.info(`Mongoose default connection open to ${url}`));

  mongoose.connection.on('error', err => logger.error(`Mongoose default connection error: ${err}`) && reject(err));

  mongoose.connection.on('disconnected', () => logger.info('Mongoose default connection disconnected'));

  mongoose.connection.once('open', async () => {
    logger.info('Mongoose default connection is open');
    const count = await User.count({});
    if (count > 0) return resolve();
    debug('creating "admin" user since there\'s no users in the database');

    await new User({ name: 'Administrator', username: 'admin', password: 'admin', isAdmin: true }).save();
    resolve();
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.error('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
});
