#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const mongoose = require('mongoose');
const Quote = mongoose.model('Quote', new mongoose.Schema({
  data: { type: String, required: true },
  movie: { type: String, required: true },
  series: { type: String } 
},{
  timestamps: true
}));

let fileTarget, movie, series;
const dbURI = 'mongodb://localhost/quotedb-test';

mongoose.Promise = Promise;
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log(chalk.green(`Mongoose default connection open to ${dbURI}`)); 
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(chalk.red('Mongoose default connection disconnected through app termination'));
    process.exit(0);
  });
});

if (process.argv[2] && process.argv[3]) {
  fileTarget = process.argv[2];
  movie = process.argv[3];
  series = process.argv[4] || '';
} else {
  console.error(chalk.red.bold('Must supply filename and group.\n'));
  process.exit(1);
}

const inputFile = fs.readFileSync(fileTarget).toString().trim();

const promises = [];

const quotes = inputFile.split('\n');

quotes.forEach(quote => {
  const data = quote.split('¶').join('\n');
  promises.push(new Quote({data, movie, series}).save());
});

Promise.all(promises)
  .then(results => {
    results.forEach(el => console.log(`quote added: ${chalk.yellow.bold(el._id)}`));
    process.exit(0);
  })
  .catch(err => console.error(err));

