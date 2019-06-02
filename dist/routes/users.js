'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _hasRole = require('../lib/hasRole');

var _hasRole2 = _interopRequireDefault(_hasRole);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line
var jsonParser = _bodyParser2.default.json();

router
// Retrieve all Users
  .get('/', function (req, res, next) {
    _user2.default.find({}).lean().then(function (users) {
      res.json(users);
    }).catch(function (err) {
      return next({
        code: 404,
        error: err,
        msg: 'No users found'
      });
    });
  })
// Retrieve a specific User
  .get('/:userId', function (req, res, next) {
    _user2.default.findById(req.params.userId).lean().then(function (user) {
      res.json(user);
    }).catch(function (err) {
      next({
        code: 404,
        error: err,
        msg: 'User not found'
      });
    });
  })
// Create a User
  .post('/', jsonParser, function (req, res, next) {
    new _user2.default(req.body).save().then(function (user) {
      res.json(user);
    }).catch(function (err) {
      next({
        code: 500,
        error: err,
        msg: 'Unable to create user'
      });
    });
  })
// Create a role for specific User
  .post('/:userId/roles/:role', (0, _hasRole2.default)('admin'), function (req, res, next) {
    _user2.default.findById(req.params.userId).then(function (user) {
      if (!user) throw new Error('invalid authentication');
      var role = req.params.role;
      if (user.roles.indexOf(role) > -1) return user;
      user.roles.push(role);
      return user.save();
    }).then(function (user) {
      res.json({
        id: user.id,
        roles: user.roles
      });
    }).catch(function (err) {
      next({
        code: 500,
        error: err,
        msg: 'Unable to add user role'
      });
    });
  })
// Update/change a specific User
  .put('/:id', jsonParser, function (req, res, next) {
    _user2.default.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).then(function (updatedUser) {
      if (updatedUser) res.json(updatedUser);
    }).catch(function (err) {
      next({
        code: 500,
        error: err,
        msg: 'Unable to modify user'
      });
    });
  })
// Remove a User
  .delete('/:id', function (req, res, next) {
    _user2.default.findByIdAndRemove(req.params.id).then(function (removedUser) {
      if (removedUser) res.json(removedUser);
    }).catch(function (err) {
      next({
        code: 500,
        error: err,
        msg: 'Unable to remove user'
      });
    });
  });

exports.default = router;