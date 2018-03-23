'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ = require('../lib/404');

var _2 = _interopRequireDefault(_);

var _quote = require('../models/quote');

var _quote2 = _interopRequireDefault(_quote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line

router.get('/random/:movie', function (req, res, next) {
  var movie = req.params.movie;
  _quote2.default.find({ movie: movie }).lean().then(function (quotes) {
    var numQuotes = quotes.length;
    if (numQuotes === 0) next(_2.default);
    if (numQuotes === 1) return res.send(quotes[0]);
    var randomQuote = Math.floor(Math.random() * numQuotes);
    res.send(quotes[randomQuote]);
  }).catch(function (err) {
    return next({
      code: 404,
      error: err,
      msg: 'No quotes found'
    });
  });
});

exports.default = router;