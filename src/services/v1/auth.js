const debug = require('debug')('app:services:v1:auth');

const UserService = require('../../services/v1/user');
const UnauthorizedError = require('../../errors/unauthorized');
const TokenService = require('../../services/v1/token');

const AuthService = {

  /**
   *
   * @param {String} username
   * @param {String} password
   * @return {Promise.<*>}
   */
  login: async (username, password) => {
    debug(`user "${username}" logging in`);

    const user = await UserService.findOne({ username });
    if (!user) throw new UnauthorizedError();

    const validPassword = await user.comparePassword(password);
    if (!validPassword) throw new UnauthorizedError();

    await TokenService.delete(user);
    return TokenService.create(user);
  },

  /**
   *
   * @param token
   * @return {Promise.<void>}
   */
  authorize: async (token) => {
    debug(`authorizing token "${token}"`);

    token = await TokenService.findOne({ value: token, active: true });
    if (!token) throw new UnauthorizedError('Invalid token');

    await token.populate('user').execPopulate();

    return token.user;
  },

};

module.exports = AuthService;
