const debug = require('debug')('app:routes:v1:user');
const express = require('express');

debug('configuring routes');

const router = express.Router();

const AuthMiddleware = require('../../middlewares/auth');
const UserController = require('../../controllers/v1/user');

router.use(AuthMiddleware.isAuthenticated);

router.route('/')
  .get(AuthMiddleware.isAdmin, UserController.list)
  .post(AuthMiddleware.isAdmin, UserController.create);

router.route('/:id')
  .get(UserController.findById)
  .put(UserController.update)
  .delete(UserController.delete);

router.route('/:id/environments')
  .get(UserController.environments);

module.exports = router;
