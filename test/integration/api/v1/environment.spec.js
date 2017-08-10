const chai = require('chai');
const request = require('supertest');
const faker = require('faker');
const getPort = require('get-port');

chai.should();

// Setup
let token = '';
const getToken = async (username = 'admin', password = 'admin') => {
  const res = await request(app)
    .post('/v1/auth')
    .send({ username, password })
    .expect(200);

  return res.body.token;
};

let app = null;

before((done) => {
  getPort().then((port) => {
    process.env.PORT = port;
    app = require('../../../../src/app');
    app.on('ready', done);
    app.on('error', (err) => {
      throw err;
    });
  });
});

beforeEach(async () => {
  token = await getToken();
});

suite('Environment', () => {
  suite('#create', () => {
    test('should create a new environment', async () => {
      const envName = faker.internet.userName();

      const res = await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: envName })
        .expect(201);

      res.body.should.be.an('object');
      res.body.name.should.be.equal(envName);
    });

    test('should fail to create a new environment when name is duplicated', async () => {
      const envName = faker.internet.userName();

      await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: envName })
        .expect(201);

      const res = await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: envName })
        .expect(500);

      res.body.should.be.an('object');
      res.body.error.should.be.equal('ValidationError: name: Given name is already in use');
    });

    test('should fail to create a new environment when name is undefined', async () => {
      const res = await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(500);

      res.body.should.be.an('object');
      res.body.error.should.be.equal('ValidationError: name: Environment [name] field is required');
    });

    test('should fail to create a new environment when name is blank', async () => {
      const res = await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: ' ' })
        .expect(500);

      res.body.should.be.an('object');
      res.body.error.should.be.equal('ValidationError: name: Environment [name] field is required');
    });
  });

  suite('#delete', () => {
    test('should delete an environment', async () => {
      const envName = faker.internet.userName();

      await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: envName })
        .expect(201);

      const res = await request(app)
        .delete(`/v1/environment/${envName}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      res.body
        .should.be.an('object')
        .that.is.empty;
    });

    test('should succeed even when environment does not exist', async () => {
      const envName = faker.internet.userName();

      const res = await request(app)
        .delete(`/v1/environment/${envName}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      res.body
        .should.be.an('object')
        .that.is.empty;
    });
  });

  suite('#update', () => {
    test('should update an environment with some variables', async () => {
      const envName = faker.internet.userName();
      const varName1 = faker.internet.userName();
      const varName2 = faker.internet.userName();
      const varValue1 = faker.internet.userName();
      const varValue2 = faker.internet.userName();
      const vars = {};
      vars[varName1] = varValue1;
      vars[varName2] = varValue2;

      await request(app)
        .post('/v1/environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: envName })
        .expect(201);

      const res = await request(app)
        .put(`/v1/environment/${envName}`)
        .set('Authorization', `Bearer ${token}`)
        .send(vars)
        .expect(200);

      res.body.should.be.an('object');
      res.body.name.should.be.equal(envName);
      res.body.variables.should.be.an('array').with.lengthOf(2);
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
