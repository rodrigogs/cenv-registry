const chai = require('chai');
const request = require('supertest');
const faker = require('faker');

const app = require('../../../../src/app');

chai.should();

let token = '';

before((done) => {
  app.on('ready', done);
  app.on('error', (err) => {
    throw err;
  });
});

beforeEach(async () => {
  const res = await request(app)
    .post('/v1/auth')
    .set('Authorization', `Bearer ${token}`)
    .send({ username: 'admin', password: 'admin' })
    .expect(200);

  token = res.body.token;
});

suite('Environment', () => {
  suite('#create', () => {
    test('should create a new environment', async () => {
      const envName = faker.random.word();
      const res = await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: envName })
        .expect(200);

      res.body.should.be.an('object');
      res.body.name.should.be.equal(envName);
    });

    test('should create a new environment', async () => {
      const envName = faker.random.word();
      const res = await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: envName })
        .expect(200);

      res.body.should.be.an('object');
      res.body.name.should.be.equal(envName);
    });
  });

  suite('#list', () => {
    test('should return an array list with Environments', async () => {
      const res = await request(app)
        .get('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      res.body.should.be.an('array');
    });
  });
});
