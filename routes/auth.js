const router = require('express').Router();
const bodyParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../lib/token');

router
  .post('/signup', bodyParser, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    delete req.body.password;

    if (!password) {
      return res.status(400).json({
        msg: 'No password entered. Please enter a password!'
      });
    }

    User.findOne({username})
      .then( exists => {
        if (exists) {
          return res.status(500).json({
            msg: 'Unable to create username',
            reason: 'Username already exists.  Please choose another.'
          });
        }

        const user = new User(req.body);
        user.generateHash(password);
        return user.save()
          .then(user => token.sign(user))
          .then(token => res.json({token, id: user._id})); // nested .then on purpose to preserve user status.
      })
      .catch(err => {
        res.status(500).json({
          msg: 'Unable to create a user',
          reason: err
        });
      });
  })

  .post('/signin', bodyParser, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    delete req.body;

    User.findOne({username})
      .then(user => {
        if (!user || !user.compareHash(password)) {
          return res.status(400).json({
            msg: 'Authentication failed.'
          });
        }

        token.sign(user)
          .then(token => res.json({token, id: user._id}));
      })
      .catch(err => {
        res.status(500).json({
          msg: 'Authentication Failed',
          reason: err
        });
      });
  });

module.exports = router;
