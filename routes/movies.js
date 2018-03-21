import express from 'express';
import std404ErrMsg from '../lib/404';
import Quote from '../models/quote';
const router = express.Router(); // eslint-disable-line

router
  .get('/random/:movie', (req, res, next) => {
    let movie = req.params.movie;
    Quote
      .find({movie: movie})
      .lean()
      .then(quotes => {
        let numQuotes = quotes.length;
        if (numQuotes === 0) next(std404ErrMsg);
        if (numQuotes === 1) return res.send(quotes[0]);
        let randomQuote = Math.floor(Math.random() * numQuotes);
        res.send(quotes[randomQuote]);
      })
      .catch(err => next({
        code: 404,
        error: err,
        msg: 'No quotes found',
      }));
  });

export default router;
