const debug = require('debug')('app:routes:v1:environment');
const express = require('express');

debug('configuring routes');

const router = express.Router();

const AuthMiddleware = require('../../middlewares/auth');
const EnvironmentController = require('../../controllers/v1/environment');

router.use(AuthMiddleware.isAuthenticated);

router.route('/')
  .get(EnvironmentController.list)
  .post(EnvironmentController.create);

router.route('/:environment')
  .get(EnvironmentController.vars)
  .put(EnvironmentController.update)
  .delete(EnvironmentController.delete);

router.route('/:environment/:variable')
  .get(EnvironmentController.getVar)
  .put(EnvironmentController.updateVar)
  .delete(EnvironmentController.deleteVar);

module.exports = router;
