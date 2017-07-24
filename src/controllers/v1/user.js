const debug = require('debug')('app:controllers:v1:environment');
const _ = require('lodash');

const UserService = require('../../services/v1/user');

const UserController = {

  /**
   * @api {get} /v1/user/ List users
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiDescription Lists all users.
   *
   * @apiExample Example usage:
   * curl -i http://localhost:3000/v1/user
   *
   * @apiSuccess {Object[]} users Array of users.
   */
  list: async (req, res, next) => {
    debug('list action');

    const { fields, limit, skip, sort } = req.params;

    try {
      const users = await UserService.list({
        criteria: {},
        fields,
        limit: Number(limit) || null,
        skip: Number(skip) || null,
        sort,
      });
      res.status(200).send(users);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {get} /v1/user/:id Find user by id
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiDescription Finds an user by its id.
   *
   * @apiExample Example usage:
   * curl -X GET http://localhost:3000/v1/user/597168b5f780cc3a48cf6215
   *
   * @apiParam    {String}    name          User name.
   * @apiParam    {String}    username      User username.
   * @apiParam    {String}    password      User password.
   * @apiParam    {Boolean}   isAdmin       User is admin.
   * @apiParam    {String[]}  environments  User environments.
   *
   * @apiSuccess  {String}  _id             User id.
   * @apiSuccess  {String}  name            User name.
   * @apiSuccess  {String}  username        User username.
   * @apiSuccess  {String}  password        User password.
   * @apiSuccess  {Boolean} isAdmin         User is admin.
   * @apiSuccess  {String}  environments    User environments.
   * @apiSuccess  {String}  creation_date   User creation date.
   */
  findById: async (req, res, next) => {
    debug('find user by id');

    const { id } = req.params;

    try {
      UserService.validateUserSession(req, id);
      const user = await UserService.findById(id);
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {post} /v1/user/ Create user
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiDescription Creates a new user.
   *
   * @apiExample Example usage:
   * curl -X POST http://localhost:3000/v1/user -d name=myenv
   *
   * @apiParam    {String}    name          User name.
   * @apiParam    {String}    username      User username.
   * @apiParam    {String}    password      User password.
   * @apiParam    {Boolean}   isAdmin       User is admin.
   * @apiParam    {String[]}  environments  User environments.
   *
   * @apiSuccess  {String}  _id             User id.
   * @apiSuccess  {String}  name            User name.
   * @apiSuccess  {String}  username        User username.
   * @apiSuccess  {String}  password        User password.
   * @apiSuccess  {Boolean} isAdmin         User is admin.
   * @apiSuccess  {String}  environments    User environments.
   * @apiSuccess  {String}  creation_date   User creation date.
   */
  create: async (req, res, next) => {
    debug('create action');

    const { body } = req;

    try {
      if (body.environments && _.isString(body.environments)) {
        body.environments = body.environments.split(',');
      }
      const user = await UserService.create(body);
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {put} /v1/user/:id Update user
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiDescription Updates an user.
   *
   * @apiParam    {String}    name          User name.
   * @apiParam    {String}    username      User username.
   * @apiParam    {String}    password      User password.
   * @apiParam    {Boolean}   isAdmin       User is admin.
   * @apiParam    {String[]}  environments  User environments.
   *
   * @apiExample Example usage:
   * curl -X PUT http://localhost:3000/v1/user/12345 -d myvar=myvalue
   */
  update: async (req, res, next) => {
    debug('update action');

    const { params, body } = req;

    try {
      if (body.environments && _.isString(body.environments)) {
        body.environments = body.environments.split(',');
      }
      UserService.validateUserSession(req, params.id);
      const user = await UserService.update(params.id, body);
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {delete} /v1/user/:id Delete user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiDescription Deletes an user.
   *
   * @apiParam {String} id User id.
   *
   * @apiExample Example usage:
   * curl -X DELETE http://localhost:3000/v1/user/12345
   */
  delete: async (req, res, next) => {
    debug('delete action');

    const { params } = req;

    try {
      UserService.validateUserSession(req, params.id);
      await UserService.delete(params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @api {delete} /v1/user/:id/environments Get user environments
   * @apiVersion 1.0.0
   * @apiName GetUserEnvironments
   * @apiGroup User
   * @apiPermission user
   *
   * @apiDescription Get user environments.
   *
   * @apiParam {String} id User id.
   *
   * @apiExample Example usage:
   * curl -X GET http://localhost:3000/v1/user/12345/environments
   */
  environments: async (req, res, next) => {
    debug('delete action');

    const { params } = req;

    try {
      UserService.validateUserSession(req, params.id);
      const user = await UserService.findById(params.id);
      const environments = await user.populate('environments').execPopulate();
      res.status(200).send(environments);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = UserController;
