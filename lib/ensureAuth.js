const tokenCheck = require('./token');

module.exports = function ensureAuth(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      error: 'no token provided'
    });
  }
  tokenCheck.verify(token)
    .then(payload => {
      req.user = payload;
      next();
    })
    .catch(() => {
      res.status(401).json({
        error: 'invalid token'
      });
    });
};
