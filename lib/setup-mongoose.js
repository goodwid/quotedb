import mongoose from 'mongoose';

const dbURI = process.env.TEST ? 'mongodb://localhost/quotedb' : process.env.MONGO_URI;
// const dbURI = process.env.MONGO_URI;
if(!dbURI) console.log('No database defined.'),process.exit(1);
mongoose.Promise = Promise;
mongoose.connect(dbURI, { useNewUrlParser: true });

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

export default mongoose.connection;
