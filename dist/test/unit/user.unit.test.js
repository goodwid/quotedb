'use strict';

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('User model', function () {
  it('requires name', function (done) {
    var user = new _user2.default();
    user.validate().then(function () {
      return done('expected error');
    }).catch(function () {
      return done();
    });
  });

  it('validates with required fields', function (done) {
    var user = new _user2.default({ username: 'fred', password: 'test' });
    user.validate().then(done).catch(done);
  });

  after('remove mongoose model', function () {
    delete _mongoose2.default.connection.models['User'];
  });
});