const debug = require('debug')('app:routes:v1');
const express = require('express');

debug('configuring routes');

const router = express.Router();

const auth = require('./auth');
const user = require('./user');
const environment = require('./environment');

router.use('/auth', auth);
router.use('/user', user);
router.use('/environment', environment);

module.exports = router;
