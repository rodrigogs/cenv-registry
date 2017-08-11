const debug = require('debug')('app:config:statusHandler');
const mongoose = require('./mongoose');

const STATUSES = {
  HALT: 'halt',
  STARTING: 'starting',
  READY: 'ready',
  ERR: 'err',
};

let status = STATUSES.HALT;

const _resolve = (app) => {
  mongoose.then(() => app.emit('ready'));
  mongoose.catch(err => app.emit('error', err));
};

const getStatus = () => status;

const setStatus = newStatus => () => {
  debug(`setting app status to ${newStatus}`);
  status = newStatus;
};

const handle = (app) => {
  debug('starting to handle app status');
  status = STATUSES.STARTING;

  _resolve(app);

  app.on('ready', setStatus(STATUSES.READY));
  app.on('error', setStatus(STATUSES.ERR));
};

module.exports = {
  handle,
  getStatus,
  setStatus,
  STATUSES,
};
