const debug = require('debug')('app:services:v1:user');
const _ = require('lodash');

const UnauthorizedError = require('../../errors/unauthorized');
const NotFoundError = require('../../errors/notFound');
const User = require('../../models/v1/user');

const UserService = {

  /**
   *
   * @return {Promise|Array|{index: number, input: string}|*}
   */
  list: (query) => {
    debug('listing users');

    const { criteria, fields, limit, skip, sort } = query;

    return User.find(criteria, fields)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .exec();
  },

  /**
   *
   * @param {Object} criteria
   * @return {Promise}
   */
  findOne: async (criteria) => {
    return User.findOne(criteria).exec();
  },

  /**
   *
   * @param id
   * @return {Promise}
   */
  findById: async (id) => {
    debug(`retrieving user "${id}"`);

    const user = await User.findOne({ _id: id }).exec();
    if (!user) throw new NotFoundError(`user "${id}" not found`);

    return user.populate('environments').execPopulate();
  },

  /**
   *
   * @param body
   * @return {Promise.<void>}
   */
  create: async (body) => {
    debug(`creating user "${body.name}"`);

    const user = new User(body);
    await user.save();
    return user;
  },

  /**
   *
   * @param id
   * @param body
   * @return {Promise.<*|Promise>}
   */
  update: async (id, body) => {
    debug(`updating user "${id}"`);

    const user = await UserService.findById(id);
    await _.merge(user, body).save();
    return user;
  },

  /**
   *
   * @param id
   * @return {Promise.<Promise|Array|{index: number, input: string}|*>}
   */
  delete: async (id) => {
    debug(`deleting user "${id}"`);

    return User.remove({ _id: id }).exec();
  },

  /**
   *
   * @param {Object} req
   * @param {String} id
   */
  validateUserSession: (req, id) => {
    if (!req.user.isAdmin && req.user.id !== id) {
      throw new UnauthorizedError('Current action can only be performed to the authenticated user or by an administrator');
    }
  },

};

module.exports = UserService;
