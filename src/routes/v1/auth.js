const debug = require('debug')('app:routes:v1:auth');
const express = require('express');

debug('configuring routes');

const router = express.Router();

const AuthController = require('../../controllers/v1/auth');

router.route('/')
  .post(AuthController.token);

module.exports = router;
