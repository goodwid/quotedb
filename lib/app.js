import express from 'express';
const app = express();
import morgan from 'morgan';
import users from '../routes/users';
import quotes from '../routes/quotes';
const API_URL = '/api/quotedb/v1';

app.use(morgan('dev'));

app.use('/', express.static('public'));
app.use(`${API_URL}/`, auth);
app.use(`${API_URL}/quotes`, quotes);

app.use((err, req, res, next) => { // eslint-disable-line
  console.error(err); // eslint-disable-line
  res.status(err.code || 500).json({
    code: 500,
    error: err.error || 'Server error',
    msg: err.msg,
  });
});

export default app;