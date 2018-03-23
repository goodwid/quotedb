'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _token = require('../lib/token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var jsonParser = _bodyParser2.default.json();


router.post('/signup', jsonParser, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  delete req.body.password;

  if (!password) {
    return res.status(400).json({
      msg: 'No password entered. Please enter a password!'
    });
  }

  _user2.default.findOne({ username: username }).then(function (exists) {
    if (exists) {
      return res.status(500).json({
        msg: 'Unable to create username',
        reason: 'Username already exists.  Please choose another.'
      });
    }

    var user = new _user2.default(req.body);
    user.generateHash(password);
    return user.save().then(function (user) {
      return _token2.default.sign(user);
    }).then(function (token) {
      return res.json({ token: token, id: user._id });
    }); // nested .then on purpose to preserve user status.
  }).catch(function (err) {
    res.status(500).json({
      msg: 'Unable to create a user',
      reason: err
    });
  });
}).post('/signin', jsonParser, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  delete req.body;

  _user2.default.findOne({ username: username }).then(function (user) {
    if (!user || !user.compareHash(password)) {
      return res.status(400).json({
        msg: 'Authentication failed.'
      });
    }

    _token2.default.sign(user).then(function (token) {
      return res.json({ token: token, id: user._id });
    });
  }).catch(function (err) {
    res.status(500).json({
      msg: 'Authentication Failed',
      reason: err
    });
  });
});

module.exports = router;