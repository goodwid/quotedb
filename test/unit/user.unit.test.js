import User from '../../models/user';
import mongoose from 'mongoose';

describe('User model', () => {
  it('requires name', done => {
    const user = new User();
    user.validate()
      .then(() => done('expected error'))
      .catch(() => done());
  });

  it('validates with required fields', done => {
    const user = new User({username: 'fred', password: 'test'});
    user.validate()
      .then(done)
      .catch(done);
  });

  after('remove mongoose model', () => {
    delete mongoose.connection.models['User'];
  });

});
