import jwt from 'jsonwebtoken';

const superSecret = process.env.APP_SECRET || 'ABDEF23481049';

if (!superSecret && process.env.NODE_ENV === 'production') {
  console.log('No env for APP_SECRET');
  process.exit(1);
}

export default {
  sign(user) {
    return new Promise((resolve, reject) => {
      jwt.sign({
        id: user.id,
        roles: user.roles,
        username: user.username,
      }, superSecret, null, (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      });
    });
  },
  verify(token) {
    if (!token) return Promise.reject('No token provided!');
    return new Promise((resolve, reject) => {
      jwt.verify(token, superSecret, (err, payload) => {
        if (err) return reject(err);
        return resolve(payload);
      });
    });
  },
};
