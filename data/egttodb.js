#!/usr/bin/env node

const fs = require('fs');
const mongoose = require('mongoose');
const dbURI = process.env.MONGO_URI || 'mongodb://localhost/quotedb';


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${dbURI}`); // eslint-disable-line
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`); // eslint-disable-line
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected'); // eslint-disable-line
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination'); // eslint-disable-line
    process.exit(0);
  });
});


mongoose.Promise = Promise;
mongoose.connect(dbURI);

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
  promises.push(new Quote({data, movie}).save());
});

Promise.all(promises)
  .then(results => {
    results.forEach(el => console.log(`quote added: ${el._id}`));
    process.exit(0);
  })
  .catch(err => console.error(err));





