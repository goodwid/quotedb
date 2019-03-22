import express from 'express';
import bodyParser from 'body-parser';
import std404ErrMsg from '../lib/404';
import hasRole from '../lib/hasRole';
import Quote from '../models/quote';
import isAuth from '../lib/isAuth';
const router = express.Router(); // eslint-disable-line
const jsonParser = bodyParser.json();

router
  // Retrieve all Quotes
  .get('/', (req, res, next) => {
    Quote
      .find({})
      .lean()
      .then(quotes => {
        if (quotes) res.json(quotes);
        else next(std404ErrMsg);
      })
      .catch(err => next({
        code: 404,
        error: err,
        msg: 'No quotes found'
      }));
  })
  // Retrieve a single quote by id
  .get('/:id', (req, res, next) => {
    let id = req.params.id;
    Quote
      .findById(id)
      .lean()
      .then(quote => {
        if (quote) res.json(quote);
        else next(std404ErrMsg);
      })
      .catch(err => next({
        code: 404,
        error: err,
        msg: 'No quote found'
      }));
  })
  // Create a Quote
  .post('/', jsonParser, isAuth, (req, res, next) => {
    new Quote(req.body)
      .save()
      .then(quote => {
        if (quote) res.json(quote);
        else next(std404ErrMsg);
      })
      .catch(err => {
        next({
          code: 500,
          error: err,
          msg: 'Unable to create quote',
        });
      });
  })
  // Update/change a specific Quote
  .put('/:id', jsonParser, isAuth, hasRole('admin'), (req, res, next) => {
    Quote
      .findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      .then(updatedQuote => {
        if (updatedQuote) res.json(updatedQuote);
        else next(std404ErrMsg);
      })
      .catch(err => {
        next({
          code: 500,
          msg: 'Unable to modify quote',
          error: err,
        });
      });
  })
  // Remove a Quote
  .delete('/:id', isAuth, hasRole('admin'), (req, res, next) => {
    Quote
      .findOneAndDelete(req.params.id)
      .then(removedQuote => {
        if (removedQuote) res.json(removedQuote);
        else next(std404ErrMsg);
      })
      .catch(err => {
        next({
          code: 500,
          error: err,
          msg: 'Unable to remove quote',
        });
      });
  });

export default router;
