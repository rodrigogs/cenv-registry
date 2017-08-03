const debug = require('debug')('app:controllers:v1:auth');

const AuthService = require('../../services/v1/auth');

const AuthController = {

  /**
   * @api {post} /v1/auth/ Authenticate user
   * @apiVersion 1.0.0
   * @apiName AuthToken
   * @apiGroup Auth
   * @apiPermission user
   *
   * @apiDescription Authenticates an user.
   *
   * @apiExample Example usage:
   * curl -X POST http://localhost:3000/v1/auth \
   *  -H 'content-type: application/x-www-form-urlencoded' \
   *  -d 'username=teste&password=123'
   *
   * @apiParam {String} username User's username.
   * @apiParam {String} password User's password.
   *
   * @apiSuccess {String} token User token.
   */
  token: async (req, res, next) => {
    debug('login action');
    try {
      const { username, password } = req.body;
      const token = await AuthService.login(username, password);
      res.status(200).send({ token: token.value });
    } catch (ex) {
      next(ex);
    }
  },

};

module.exports = AuthController;
