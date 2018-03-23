'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _ = require('../lib/404');

var _2 = _interopRequireDefault(_);

var _hasRole = require('../lib/hasRole');

var _hasRole2 = _interopRequireDefault(_hasRole);

var _quote = require('../models/quote');

var _quote2 = _interopRequireDefault(_quote);

var _isAuth = require('../lib/isAuth');

var _isAuth2 = _interopRequireDefault(_isAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line
var jsonParser = _bodyParser2.default.json();

router
// Retrieve all Quotes
.get('/', function (req, res, next) {
  _quote2.default.find({}).lean().then(function (quotes) {
    if (quotes) res.json(quotes);else next(_2.default);
  }).catch(function (err) {
    return next({
      code: 404,
      error: err,
      msg: 'No quotes found'
    });
  });
})
// Retrieve a single quote by id
.get('/:id', function (req, res, next) {
  var id = req.params.id;
  _quote2.default.findById(id).lean().then(function (quote) {
    if (quote) res.json(quote);else next(_2.default);
  }).catch(function (err) {
    return next({
      code: 404,
      error: err,
      msg: 'No quote found'
    });
  });
})
// Create a Quote
.post('/', jsonParser, _isAuth2.default, function (req, res, next) {
  new _quote2.default(req.body).save().then(function (quote) {
    if (quote) res.json(quote);else next(_2.default);
  }).catch(function (err) {
    next({
      code: 500,
      error: err,
      msg: 'Unable to create quote'
    });
  });
})
// Update/change a specific Quote
.put('/:id', jsonParser, _isAuth2.default, (0, _hasRole2.default)('admin'), function (req, res, next) {
  _quote2.default.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).then(function (updatedQuote) {
    if (updatedQuote) res.json(updatedQuote);else next(_2.default);
  }).catch(function (err) {
    next({
      code: 500,
      msg: 'Unable to modify quote',
      error: err
    });
  });
})
// Remove a Quote
.delete('/:id', _isAuth2.default, (0, _hasRole2.default)('admin'), function (req, res, next) {
  _quote2.default.findByIdAndRemove(req.params.id).then(function (removedQuote) {
    if (removedQuote) res.json(removedQuote);else next(_2.default);
  }).catch(function (err) {
    next({
      code: 500,
      error: err,
      msg: 'Unable to remove quote'
    });
  });
});

exports.default = router;