import express from 'express';
import bodyParser from 'body-parser';
import std404ErrMsg from '../lib/404';
import hasRole from '../lib/hasRole';
import Quote from '../models/quote';
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
        msg: 'No quotes found',
      }));
  })
  // Create a Quote
  .post('/', jsonParser, (req, res, next) => {
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
  .put('/:id', jsonParser, (req, res, next) => {
    Quote
      .findByIdAndUpdate(req.params.id, req.body, {
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
  .delete('/:id', (req, res, next) => {
    Quote
      .findByIdAndRemove(req.params.id)
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
