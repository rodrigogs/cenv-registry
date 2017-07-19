const debug = require('debug')('app:services:v1:user');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');

const Token = require('../../models/v1/token');

const TokenService = {

  /**
   *
   * @param {Object} criteria
   * @return {Promise}
   */
  findOne: async (criteria) => {
    return Token.findOne(criteria).exec();
  },

  /**
   *
   * @param user
   * @return {Promise.<void>}
   */
  create: async (user) => {
    debug(`creating token for user "${user.name}"`);

    const token = new Token({ user });
    token.value = uuidv4(256);
    await token.save();
    return token;
  },

  /**
   *
   * @param user
   * @return {Promise.<Promise|Array|{index: number, input: string}|*>}
   */
  delete: async (user) => {
    debug(`deleting token for user "${user.name}"`);

    const tokens = await Token.find({ user }).exec();
    const promises = _.map(tokens, (token) => {
      token.active = false;
      return token.save();
    });

    return Promise.all(promises);
  },

};

module.exports = TokenService;
