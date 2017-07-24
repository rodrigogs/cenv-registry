const debug = require('debug')('app:controllers:v1:environment');

const EnvironmentService = require('../../services/v1/environment');

const EnvironmentController = {

  /**
   * @api {get} /v1/environment/ List environments
   * @apiVersion 1.0.0
   * @apiName ListEnvironments
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Lists all user's environments.
   *
   * @apiExample Example usage:
   * curl -i http://localhost:3000/v1/environment
   *
   * @apiSuccess {Object[]} environments Array of environments.
   */
  list: async (req, res, next) => {
    debug('list action');

    try {
      const environments = await EnvironmentService.list();
      res.status(200).send(environments);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {get} /v1/environment/:environment Find environment by name
   * @apiVersion 1.0.0
   * @apiName GetEnvironment
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Finds an environment by its name.
   *
   * @apiExample Example usage:
   * curl -i http://localhost:3000/v1/environment/myenv
   *
   * @apiSuccess {String}   _id             Environment id.
   * @apiSuccess {String}   name            Environment name.
   * @apiSuccess {Object}   created_by      Environment creator.
   * @apiSuccess {String}   creation_date   Environment creation date.
   * @apiSuccess {Object[]} variables       Array with the environment variables.
   */
  findByName: async (req, res, next) => {
    debug('find environment by name');

    const { params } = req;

    try {
      EnvironmentService.validateUserRead(req, params.environment);
      const environment = await EnvironmentService.findByName(params.environment);
      res.status(200).send(environment);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {get} /v1/environment/:environment List environment variables
   * @apiVersion 1.0.0
   * @apiName ListEnvironmentVars
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Lists all environments's variables.
   *
   * @apiParam {String} environment Environment name.
   *
   * @apiExample Example usage:
   * curl -i http://localhost:3000/v1/environment/myenv
   *
   * @apiSuccess {Object[]} evariables Array of environment variables.
   */
  vars: async (req, res, next) => {
    debug('vars action');

    const { params } = req;

    try {
      EnvironmentService.validateUserRead(req, params.environment);
      const environment = await EnvironmentService.findByName(params.environment);
      res.status(200).send(environment.variables);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {post} /v1/environment/ Create environment
   * @apiVersion 1.0.0
   * @apiName CreateEnvironment
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Creates a new environment.
   *
   * @apiExample Example usage:
   * curl -X POST http://localhost:3000/v1/environment -d name=myenv
   *
   * @apiSuccess {String}   _id             Environment id.
   * @apiSuccess {String}   name            Environment name.
   * @apiSuccess {Object}   created_by      Environment creator.
   * @apiSuccess {String}   creation_date   Environment creation date.
   * @apiSuccess {Object[]} variables       Array with the environment variables.
   */
  create: async (req, res, next) => {
    debug('create action');

    const { user, body } = req;

    try {
      const env = await EnvironmentService.create({ name: body.name, created_by: user });
      res.status(200).send(env);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {put} /v1/environment/:environment Create environment
   * @apiVersion 1.0.0
   * @apiName UpdateEnvironment
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Updates an environment.
   *
   * @apiParam {String} environment Environment name.
   *
   * @apiExample Example usage:
   * curl -X PUT http://localhost:3000/v1/environment/myenv -d myvar=myvalue
   */
  update: async (req, res, next) => {
    debug('update action');

    const { params, body } = req;

    try {
      EnvironmentService.validateUserWrite(req, params.environment);
      const env = await EnvironmentService.update(params.environment, body);
      res.status(200).send(env);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {delete} /v1/environment/:environment Delete environment
   * @apiVersion 1.0.0
   * @apiName DeleteEnvironment
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Deletes an environment.
   *
   * @apiParam {String} environment Environment name.
   *
   * @apiExample Example usage:
   * curl -X DELETE http://localhost:3000/v1/environment/myenv
   */
  delete: async (req, res, next) => {
    debug('delete action');

    const { params } = req;

    try {
      EnvironmentService.validateUserWrite(req, params.environment);
      await EnvironmentService.delete(params.environment);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {get} /v1/environment/:environment/:variable Get environment variable
   * @apiVersion 1.0.0
   * @apiName GetVariable
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Gets a environment variable.
   *
   * @apiParam {String} environment Environment name.
   * @apiParam {String} variable Variable name.
   *
   * @apiExample Example usage:
   * curl -i http://localhost:3000/v1/environment/myenv/myvar
   */
  getVar: async (req, res, next) => {
    debug('getVar action');

    const { params } = req;

    try {
      EnvironmentService.validateUserRead(req, params.environment);
      const env = await EnvironmentService.getVar(params.environment, params.variable);
      res.status(200).send(env);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {post} /v1/environment/:environment Create environment variable
   * @apiVersion 1.0.0
   * @apiName GetVariable
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Gets a environment variable.
   *
   * @apiParam {String} environment Environment name.
   *
   * @apiExample Example usage:
   * curl -X POST http://localhost:3000/v1/environment -d name=myenv
   */
  createVar: async (req, res, next) => {
    debug('createVar action');

    const { params, body } = req;

    try {
      EnvironmentService.validateUserWrite(req, params.environment);
      const env = await EnvironmentService.createVar(params.environment, body.name, body.value);
      res.status(200).send(env);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {put} /v1/environment/:environment/:variable Create/Update environment variable
   * @apiVersion 1.0.0
   * @apiName GetVariable
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Gets a environment variable.
   *
   * @apiParam {String} environment Environment name.
   * @apiParam {String} variable Variable name.
   *
   * @apiExample Example usage:
   * curl -X PUT http://localhost:3000/v1/environment/myenv/myvar -d value=myvalue
   */
  updateVar: async (req, res, next) => {
    debug('updateVar action');

    const { params, body } = req;

    try {
      EnvironmentService.validateUserWrite(req, params.environment);
      const env = await EnvironmentService
        .updateVar(params.environment, params.variable, body.value);
      res.status(200).send(env);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {delete} /v1/environment/:environment/:variable Delete environment variable
   * @apiVersion 1.0.0
   * @apiName GetVariable
   * @apiGroup Environment
   * @apiPermission user
   *
   * @apiDescription Gets a environment variable.
   *
   * @apiParam {String} environment Environment name.
   * @apiParam {String} variable Variable name.
   *
   * @apiExample Example usage:
   * curl -X DELETE http://localhost:3000/v1/environment/myenv/myvar
   */
  deleteVar: async (req, res, next) => {
    debug('deleteVar action');

    const { params } = req;

    try {
      EnvironmentService.validateUserWrite(req, params.environment);
      await EnvironmentService.deleteVar(params.environment, params.variable);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

};

module.exports = EnvironmentController;
