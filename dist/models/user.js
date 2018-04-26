'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  roles: {
    type: [String]
  }
});

userSchema.methods.generateHash = function generateHash(password) {
  this.password = _bcryptjs2.default.hashSync(password, 8);
  return this.password;
};

userSchema.methods.compareHash = function generateHash(password) {
  return _bcryptjs2.default.compareSync(password, this.password);
};

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;

// TODO: create script to run this code before npm start (prestart in scripts of package.json)?
// create new Admin user if there are no users in the collection

var newAdmin = function newAdmin() {
  var adminData = {
    username: 'Admin',
    roles: ['admin']
  };

  var user = new User(adminData);

  user.generateHash('password');
  user.save();
};

User.find().then(function (users) {
  if (users.length === 0) newAdmin();
});