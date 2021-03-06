const chai = require('chai');
const request = require('supertest');
const faker = require('faker');

chai.should();

const app = require('../../../../src/app');
const statusHandler = require('../../../../src/config/statusHandler');

before(async () => {
  if (statusHandler.getStatus() === statusHandler.STATUSES.READY) {
    return;
  }
  if (statusHandler.getStatus() === statusHandler.STATUSES.ERR) {
    throw new Error('Application crashed');
  }
  await new Promise((resolve, reject) => {
    app.on('ready', resolve);
    app.on('error', reject);
  });
});

suite('Auth', () => {
  suite('#token', () => {
    test('should authenticate and return the authenticated token', async () => {
      const res = await request(app)
        .post('/v1/auth')
        .send({ username: 'admin', password: 'admin' })
        .expect(200);

      res.body.should.be.an('object');
      res.body.token.should.be.a('string');
    });

    test('should fail to authenticate with an invalid username', async () => {
      const res = await request(app)
        .post('/v1/auth')
        .send({ username: faker.random.word(), password: faker.random.word() })
        .expect(401);

      res.body.should.be.an('object');
      res.body.error.should.be.equal('Unauthorized');
    });
  });
});
