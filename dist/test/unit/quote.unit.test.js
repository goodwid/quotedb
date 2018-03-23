'use strict';

var _quote = require('../../models/quote');

var _quote2 = _interopRequireDefault(_quote);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Quote model', function () {
  it('requires data', function (done) {
    var quote = new _quote2.default();
    quote.validate().then(function () {
      return done('expected error');
    }).catch(function () {
      return done();
    });
  });

  it('validates with required fields', function (done) {
    var quote = new _quote2.default({ data: 'This is a quote', movie: 'movie' });
    quote.validate().then(done).catch(done);
  });

  after('remove mongoose model', function () {
    delete _mongoose2.default.connection.models['Quote'];
  });
});