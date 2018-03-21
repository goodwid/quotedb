#!/usr/bin/env node

const fs = require('fs');
const mongoose = require('mongoose');
require('../lib/setup-mongoose');
const Quote = require('../models/quote');
let fileTarget, movie;
if (process.argv[2] && process.argv[3]) {
  fileTarget = process.argv[2];
  movie = process.argv[3];
} else {
  console.error('Must supply filename and group.\n');
  process.exit(1);
}

const inputFile = fs.readFileSync(fileTarget).toString();

const promises = [];

const quotes = inputFile.split('\n');
quotes.forEach(quote => {
  const data = quote.split('¶').join('\n');
  promises.push(new Quote({data, movie}).save())
});

Promise.all(promises)
  .then(results => {
    results.forEach(el => console.log(`quote added: ${el._id}`))
    process.exit(0);
  })
  .catch(err => console.error(err));

