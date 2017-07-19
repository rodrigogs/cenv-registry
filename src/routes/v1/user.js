const debug = require('debug')('app:routes:v1:user');
const express = require('express');

debug('configuring routes');

const router = express.Router();

const AuthMiddleware = require('../../middlewares/auth');
const UserController = require('../../controllers/v1/user');

router.use(AuthMiddleware.isAuthenticated);
router.use(AuthMiddleware.isAdmin);

router.route('/')
  .get(UserController.list)
  .post(UserController.create);

module.exports = router;
