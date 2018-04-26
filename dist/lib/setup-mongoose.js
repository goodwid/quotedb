'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const mongoose = require('mongoose');

var dbURI = process.env.TEST ? 'mongodb://localhost/quotedb' : process.env.MONGO_URI;
// const dbURI = process.env.MONGO_URI;

_mongoose2.default.Promise = Promise;
_mongoose2.default.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
_mongoose2.default.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI); // eslint-disable-line
});

// If the connection throws an error
_mongoose2.default.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err); // eslint-disable-line
});

// When the connection is disconnected
_mongoose2.default.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected'); // eslint-disable-line
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  _mongoose2.default.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination'); // eslint-disable-line
    process.exit(0);
  });
});

exports.default = _mongoose2.default.connection;