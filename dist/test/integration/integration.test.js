'use strict';

var _setupMongoose = require('../../lib/setup-mongoose');

var _setupMongoose2 = _interopRequireDefault(_setupMongoose);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../../lib/app');

var _app2 = _interopRequireDefault(_app);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _token = require('../../lib/token');

var _token2 = _interopRequireDefault(_token);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);
var API_URL = '/api/quotedb/v1';

var assert = _chai2.default.assert;
var request = _chai2.default.request(_app2.default);

var testAdmin = {
  username: 'testAdmin',
  password: 'chai'
};

var testUser1 = {
  username: 'testUser1',
  password: 'test1'
};

var testUser2 = {
  username: 'testUser2',
  password: 'test2'
};

var mockQuote = {
  data: 'This is a test quote',
  movie: 'Test Movie',
  series: 'Tests'
};

describe('integration', function () {
  describe('user creation', function () {
    before('create testAdmin user', function (done) {
      this.timeout(10000);
      var adminUser = new _user2.default(testAdmin);
      adminUser.generateHash(adminUser.password);
      adminUser.roles.push('admin');
      adminUser.save().then(function (newUser) {
        _token2.default.sign(newUser);
        testAdmin.id = newUser.id;
        done();
      });
    });

    before('get token for testAdmin', function (done) {
      this.timeout(10000);
      request.post(API_URL + '/signin').send(testAdmin).end(function (err, res) {
        var result = JSON.parse(res.text);
        testAdmin.token = result.token;
        done();
      });
    });

    it('create testUser1', function (done) {
      this.timeout(10000);
      request.post(API_URL + '/signup').send(testUser1).end(function (err, res) {
        var result = JSON.parse(res.text);
        assert.property(result, 'token');
        assert.property(result, 'id');
        testUser1.token = result.token;
        testUser1.id = result.id;
        done();
      });
    });

    it('create testUser2', function (done) {
      this.timeout(10000);
      request.post(API_URL + '/signup').send(testUser2).end(function (err, res) {
        var result = JSON.parse(res.text);
        assert.property(result, 'token');
        assert.property(result, 'id');
        testUser2.token = result.token;
        testUser2.id = result.id;
        done();
      });
    });

    it('set testUser1 as admin', function (done) {
      this.timeout(10000);
      request.post(API_URL + '/users/' + testUser1.id + '/roles/admin').set('authorization', 'Bearer ' + testAdmin.token).end(function () {
        request.post(API_URL + '/signin').send(testUser1).end(function (err, res) {
          var result = JSON.parse(res.text);
          testUser1.token = result.token;
          done();
        });
      });
    });
  });

  describe('Quote endpoint', function () {
    var url = API_URL + '/quotes';

    it('POST to ' + url + ' completes with id', function (done) {
      request.post(url).set('authorization', 'Bearer ' + testUser1.token).send(mockQuote).end(function (err, res) {
        assert.equal(res.statusCode, 200);
        var result = JSON.parse(res.text);
        mockQuote.id = result._id;
        assert.property(result, '_id');
        assert.propertyVal(result, 'data', mockQuote.data);
        done();
      });
    });

    it('GET to ' + url + '/:id shows new data', function (done) {
      request.get(url + '/' + mockQuote.id).set('authorization', 'Bearer ' + testUser1.token).end(function (err, res) {
        assert.equal(res.statusCode, 200);
        var result = JSON.parse(res.text);
        assert.isObject(result);
        assert.propertyVal(result, '_id', mockQuote.id);
        done();
      });
    });

    it('PUT to ' + url + '/:id returns modified data', function (done) {
      mockQuote.data = 'newtest';
      request.put(url + '/' + mockQuote.id).set('authorization', 'Bearer ' + testUser1.token).send(mockQuote).end(function (err, res) {
        assert.equal(res.statusCode, 200);
        var result = JSON.parse(res.text);
        assert.isObject(result);
        assert.propertyVal(result, '_id', mockQuote.id);
        assert.propertyVal(result, 'data', mockQuote.data);
        done();
      });
    });

    it('DELETE to ' + url + '/:id by unauthorized user fails', function (done) {
      request.delete(url + '/' + mockQuote.id).set('authorization', 'Bearer ' + testUser2.token).end(function (err, res) {
        var result = JSON.parse(res.text);
        assert.isObject(result);
        assert.propertyVal(result, 'msg', 'Not authorized');
        request.get(url + '/' + mockQuote.id).set('authorization', 'Bearer ' + testUser2.token).end(function (err, res) {
          var getResult = JSON.parse(res.text);
          assert.propertyVal(getResult, '_id', mockQuote.id);
          done();
        });
      });
    });

    it('DELETE to ' + url + '/:id by authorized user completes', function (done) {
      request.delete(url + '/' + mockQuote.id).set('authorization', 'Bearer ' + testUser1.token).end(function (err, res) {
        var result = JSON.parse(res.text);
        assert.propertyVal(result, '_id', mockQuote.id);
        request.get(url + '/' + mockQuote.id).set('authorization', 'Bearer ' + testUser1.token).end(function (err, res) {
          var getResult = JSON.parse(res.text);
          assert.propertyVal(getResult, 'msg', 'Resource with this ID not found');
          done();
        });
      });
    });
  });

  after('delete mockQuote', function (done) {
    request.delete(API_URL + '/quotes/' + mockQuote.id).set('authorization', 'Bearer ' + testUser1.token).end(function () {
      done();
    });
  });

  after('delete testuser1', function (done) {
    this.timeout(10000);
    request.delete(API_URL + '/users/' + testUser1.id).set('authorization', 'Bearer ' + testAdmin.token).end(done);
  });

  after('delete testuser2', function (done) {
    this.timeout(10000);
    request.delete(API_URL + '/users/' + testUser2.id).set('authorization', 'Bearer ' + testAdmin.token).end(done);
  });

  after('delete testAdmin', function (done) {
    this.timeout(10000);
    request.delete(API_URL + '/users/' + testAdmin.id).set('authorization', 'Bearer ' + testAdmin.token).end(done);
  });

  after('close mongoose connection', function (done) {
    _mongoose2.default.models = {};
    _mongoose2.default.modelSchemas = {};
    _setupMongoose2.default.close();
    done();
  });
});