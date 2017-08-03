const debug = require('debug')('app:routes:v1');
const express = require('express');

debug('configuring routes');

const router = express.Router();

const getRoute = name => require(`./${name}`);

router.use('/auth', getRoute('auth'));
router.use('/user', getRoute('user'));
router.use('/environment', getRoute('environment'));

module.exports = router;
