#!/usr/bin/env node
'use strict';

require('./lib/setup-mongoose');

var _app = require('./lib/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || process.argv[2] || 9000;

_app2.default.listen(port, function () {
  console.log('server listening on port ' + port);
});