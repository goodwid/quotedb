import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  roles: {
    type: [String],
  },
});

userSchema.methods.generateHash = function generateHash(password) {
  this.password = bcrypt.hashSync(password, 8);
  return this.password;
};

userSchema.methods.compareHash = function generateHash(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

// TODO: create script to run this code before npm start (prestart in scripts of package.json)?
// create new Admin user if there are no users in the collection
const newAdmin = () => {
  const adminData = {
    username: 'Admin',
    roles: ['admin'],
  };

  const user = new User(adminData);

  user.generateHash('password');
  user.save();
};

User.find()
  .then(users => {
    if (users.length === 0) newAdmin();
  });
