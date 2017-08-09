if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line import/no-extraneous-dependencies
  require('@glimpse/glimpse').init();
}

const debug = require('debug')('app');
const util = require('util');
const EventEmitter = require('events');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

debug('bootstrapping application');

const config = require('./config');
const logger = require('./config/logger');
const routes = require('./routes');

util.inherits(express, EventEmitter);

const app = express();

app.use(morgan(config.env.HTTP_LOG_CONFIG, { stream: logger.stream }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(config.passport.initialize());
app.use(routes);

config.mongoose.connection.on('connected', () => app.emit('ready'));
config.mongoose.connection.on('error', err => app.emit('error', err));

module.exports = app;
