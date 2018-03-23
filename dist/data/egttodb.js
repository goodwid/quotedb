#!/usr/bin/env node
'use strict';

var fs = require('fs');
var mongoose = require('mongoose');
require('../lib/setup-mongoose');
var Quote = require('../models/quote');
var fileTarget = void 0,
    movie = void 0;
if (process.argv[2] && process.argv[3]) {
  fileTarget = process.argv[2];
  movie = process.argv[3];
} else {
  console.error('Must supply filename and group.\n');
  process.exit(1);
}

var inputFile = fs.readFileSync(fileTarget).toString();

var promises = [];

var quotes = inputFile.split('\n');
quotes.forEach(function (quote) {
  var data = quote.split('¶').join('\n');
  promises.push(new Quote({ data: data, movie: movie }).save());
});

Promise.all(promises).then(function (results) {
  results.forEach(function (el) {
    return console.log('quote added: ' + el._id);
  });
  process.exit(0);
}).catch(function (err) {
  return console.error(err);
});