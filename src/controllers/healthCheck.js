const debug = require('debug')('app:controllers:healthyCheck');

const HealthyCheckController = {

  /**
   * @api {get} / Health check
   * @apiVersion 1.0.0
   * @apiName HealthCheck
   * @apiGroup Health
   * @apiPermission any
   *
   * @apiDescription Verify if the API server is running.
   *
   * @apiExample Example usage:
   * curl -i http://localhost:3000/
   */
  index: (req, res) => {
    debug('executing index action');

    res.status(200).send('Application is running');
  },

};

module.exports = HealthyCheckController;
