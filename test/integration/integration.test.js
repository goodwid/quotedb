import connection from '../../lib/setup-mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../lib/app';
import User from'../../models/user';
import token from '../../lib/token';
import mongoose from 'mongoose';

chai.use(chaiHttp);
const API_URL = '/api/quotedb/v1';

const assert = chai.assert;
const request = chai.request(app).keepOpen();

const testAdmin = {
  username: 'testAdmin',
  password: 'chai',
};

const testUser1 = {
  username: 'testUser1',
  password: 'test1',
};

const testUser2 = {
  username: 'testUser2',
  password: 'test2',
};

const mockQuote = {
  data: 'This is a test quote',
  movie: 'Test Movie',
  series: 'Tests'
};

describe('integration', function () { 
  describe('user creation', function () { 
    before('create testAdmin user', function (done) { 
      this.timeout(10000);
      const adminUser = new User(testAdmin);
      adminUser.generateHash(adminUser.password);
      adminUser.roles.push('admin');
      adminUser
        .save()
        .then(newUser => {
          token.sign(newUser);
          testAdmin.id = newUser.id;
          done();
        });
    });

    before('get token for testAdmin', function (done) { 
      this.timeout(10000);
      request
        .post(`${API_URL}/signin`)
        .send(testAdmin)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          testAdmin.token = result.token;
          done();
        });
    });

    it('create testUser1', function (done) { 
      this.timeout(10000);
      request
        .post(`${API_URL}/signup`)
        .send(testUser1)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          assert.property(result, 'token');
          assert.property(result, 'id');
          testUser1.token = result.token;
          testUser1.id = result.id;
          done();
        });
    });

    it('create testUser2', function (done) { 
      this.timeout(10000);
      request
        .post(`${API_URL}/signup`)
        .send(testUser2)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          assert.property(result, 'token');
          assert.property(result, 'id');
          testUser2.token = result.token;
          testUser2.id = result.id;
          done();
        });
    });

    it('set testUser1 as admin', function (done) { 
      this.timeout(10000);
      request
        .post(`${API_URL}/users/${testUser1.id}/roles/admin`)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .end(() => {
          request
            .post(`${API_URL}/signin`)
            .send(testUser1)
            .end((err, res) => {
              const result = JSON.parse(res.text);
              testUser1.token = result.token;
              done();
            });
        });
    });
  });

  describe('Quote endpoint', function () { 
    const url = `${API_URL}/quotes`;
    
    it(`POST to ${url} completes with id`, function (done) { 
      request
        .post(url)
        .set('authorization', `Bearer ${testUser1.token}`)
        .send(mockQuote)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          mockQuote.id = result._id; 
          assert.property(result, '_id');
          assert.propertyVal(result, 'data', mockQuote.data);
          done();
        });
    });

    it(`GET to ${url}/:id shows new data`, function (done) { 
      request
        .get(`${url}/${mockQuote.id}`)
        .set('authorization', `Bearer ${testUser1.token}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, '_id', mockQuote.id);
          done();
        });
    });

    it(`PUT to ${url}/:id returns modified data`, function (done) { 
      mockQuote.data = 'newtest';
      request
        .put(`${url}/${mockQuote.id}`)
        .set('authorization', `Bearer ${testUser1.token}`)
        .send(mockQuote)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, '_id', mockQuote.id);
          assert.propertyVal(result, 'data', mockQuote.data); 
          done();
        });
    });

    it(`DELETE to ${url}/:id by unauthorized user fails`, function (done) { 
      request
        .delete(`${url}/${mockQuote.id}`)
        .set('authorization', `Bearer ${testUser2.token}`)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, 'msg', 'Not authorized');
          request
            .get(`${url}/${mockQuote.id}`)
            .set('authorization', `Bearer ${testUser2.token}`)
            .end((err, res) => { 
              const getResult = JSON.parse(res.text);
              assert.propertyVal(getResult, '_id', mockQuote.id);
              done();
            });
        });
    });

    it(`DELETE to ${url}/:id by authorized user completes`, function (done) { 
      request
        .delete(`${url}/${mockQuote.id}`)
        .set('authorization', `Bearer ${testUser1.token}`)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          assert.propertyVal(result, '_id', mockQuote.id);
          request
            .get(`${url}/${mockQuote.id}`)
            .set('authorization', `Bearer ${testUser1.token}`)
            .end((err, res) => { 
              const getResult = JSON.parse(res.text);
              assert.propertyVal(getResult, 'msg', 'Resource with this ID not found');
              done();
            });
        });
    });
  });

  after('delete mockQuote', done => {
    request
      .delete(`${API_URL}/quotes/${mockQuote.id}`)
      .set('authorization', `Bearer ${testUser1.token}`)
      .end(() => {
        done();
      });
  });

  after('delete testuser1', function (done) { 
    this.timeout(10000);
    request
      .delete(`${API_URL}/users/${testUser1.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

  after('delete testuser2', function (done) { 
    this.timeout(10000);
    request
      .delete(`${API_URL}/users/${testUser2.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

  after('delete testAdmin', function (done) { 
    this.timeout(10000);
    request
      .delete(`${API_URL}/users/${testAdmin.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

  after('close mongoose connection', (done) => {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    connection.close();
    done();
  });
});

