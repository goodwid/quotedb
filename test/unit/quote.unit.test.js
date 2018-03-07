const Quote = require('../../models/quote');
const mongoose = require('mongoose');

describe('Quote model', () => {
  it('requires data', done => {
    const quote = new Quote();
    quote.validate()
      .then(() => done('expected error'))
      .catch(() => done());
  });

  it('validates with required fields', done => {
    const quote = new Quote({data: 'This is a quote'});
    quote.validate()
      .then(done)
      .catch(done);
  });

  after('remove mongoose model', () => {
    delete mongoose.connection.models['Quote'];
  });
});