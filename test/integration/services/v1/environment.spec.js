const chai = require('chai');

chai.should();

const app = require('../../../../src/app');

const EnvironmentService = require('../../../../src/services/v1/environment');

before((done) => {
  app.on('ready', done);
  app.on('error', (err) => {
    throw err;
  });
});

suite('EnvironmentService', () => {
  suite('#list()', () => {
    test('should return an array list with Environments', async () => {
      const envs = await EnvironmentService.list();
      envs.should.be.a('array');
    });
  });
});
