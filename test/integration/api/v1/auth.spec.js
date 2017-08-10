const chai = require('chai');
const request = require('supertest');
const faker = require('faker');

const app = require('../../../../src/app');

chai.should();

before((done) => {
  app.on('ready', done);
  app.on('error', (err) => {
    throw err;
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
