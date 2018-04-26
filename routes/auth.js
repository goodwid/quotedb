import express from 'express';
const router = express.Router();
import User from '../models/user';
import token from '../lib/token';

router
  .post('/signup',  (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    delete req.body.password;

    if (!password) next({code: 400, msg: 'No password entered. Please enter a password!'});

    User.findOne({username})
      .then(exists => {
        if (exists) {
          next({
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
      .catch(err => next({err, msg: 'Unable to create a user'}));
  })

  .post('/signin', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    delete req.body;

    User.findOne({username})
      .then(user => {
        if (!user || !user.compareHash(password)) next({msg: 'Authentication Failed.'});

        token.sign(user)
          .then(token => res.json({token, id: user._id}));
      })
      .catch(err => next({err, msg: 'Authentication Failed.'}));
  });

module.exports = router;
