'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAuth;

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAuth(req, res, next) {
  if (req.method === 'OPTIONS') return next();

  var authHeader = req.headers.authorization;
  var token = authHeader ? authHeader.replace('Bearer ', '') : '';

  if (!token) {
    return next({
      code: 403,
      error: 'No token provided'
    });
  }

  return _token2.default.verify(token).then(function (payload) {
    req.user = payload;
    next();
  }).catch(function () {
    next({
      code: 403,
      error: 'Invalid token'
    });
  });
}