import Quote from '../../models/quote';
import mongoose from 'mongoose';

describe('Quote model', () => {
  it('requires data', done => {
    const quote = new Quote();
    quote.validate()
      .then(() => done('expected error'))
      .catch(() => done());
  });

  it('validates with required fields', done => {
    const quote = new Quote({data: 'This is a quote', movie: 'movie'});
    quote.validate()
      .then(done)
      .catch(done);
  });

  after('remove mongoose model', () => {
    delete mongoose.connection.models['Quote'];
  });
});