import express from 'express';
const app = express();
import morgan from 'morgan';
import compression from 'compression';
import cors from './cors';
import users from '../routes/users';
import quotes from '../routes/quotes';
import movies from '../routes/movies';
import auth from '../routes/auth';
import isAuth from './isAuth';

const API_URL = '/api/quotedb/v1';
if (process.env.NODE_ENV === 'production') app.use(morgan('combined'));
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

app.use(compression());
app.use(cors('*'));
app.use('/', express.static('public'));
app.use(`${API_URL}/`, auth);
app.use(`${API_URL}/quotes`, quotes);
app.use(`${API_URL}/movies`, movies);
app.use(`${API_URL}/users`, isAuth, users);

app.use((err, req, res, next) => { 
  // console.error(err); 
  res.status(err.code || 500).json({
    code: 500,
    error: err.error || 'Server error',
    msg: err.msg,
  });
});

export default app;