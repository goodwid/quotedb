'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _cors = require('./cors');

var _cors2 = _interopRequireDefault(_cors);

var _users = require('../routes/users');

var _users2 = _interopRequireDefault(_users);

var _quotes = require('../routes/quotes');

var _quotes2 = _interopRequireDefault(_quotes);

var _movies = require('../routes/movies');

var _movies2 = _interopRequireDefault(_movies);

var _auth = require('../routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _isAuth = require('./isAuth');

var _isAuth2 = _interopRequireDefault(_isAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();


var API_URL = '/api/quotedb/v1';
if (process.env.NODE_ENV === 'production') app.use((0, _morgan2.default)('combined'));
if (process.env.NODE_ENV === 'dev') app.use((0, _morgan2.default)('dev'));

app.use((0, _compression2.default)());
app.use((0, _cors2.default)('*'));
app.use('/', _express2.default.static('public'));
app.use(API_URL + '/', _auth2.default);
app.use(API_URL + '/quotes', _quotes2.default);
app.use(API_URL + '/movies', _movies2.default);
app.use(API_URL + '/users', _isAuth2.default, _users2.default);

app.use(function (err, req, res, next) {
  // console.error(err); 
  res.status(err.code || 500).json({
    code: 500,
    error: err.error || 'Server error',
    msg: err.msg
  });
});

exports.default = app;