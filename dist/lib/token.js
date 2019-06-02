'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var superSecret = process.env.APP_SECRET;

if (!superSecret) {
  console.log('No env for APP_SECRET');
  process.exit(1);
}

exports.default = {
  sign: function sign(user) {
    return new Promise(function (resolve, reject) {
      _jsonwebtoken2.default.sign({
        id: user.id,
        roles: user.roles,
        username: user.username
      }, superSecret, null, function (err, token) {
        if (err) return reject(err);
        return resolve(token);
      });
    });
  },
  verify: function verify(token) {
    if (!token) return Promise.reject('No token provided!');
    return new Promise(function (resolve, reject) {
      _jsonwebtoken2.default.verify(token, superSecret, function (err, payload) {
        if (err) return reject(err);
        return resolve(payload);
      });
    });
  }
};