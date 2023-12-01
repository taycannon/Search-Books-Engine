const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const authMiddleware = (req, res, next) => {
  // allows token to be sent via req.query or headers
  let token = req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return res.status(400).json({ message: 'You have no token!' });
  }

  // verify token and get user data out of it
  try {
    const { data } = jwt.verify(token, secret, { maxAge: '2h' });
    req.user = data;
  } catch (err) {
    console.log('Invalid token');
    return res.status(400).json({ message: 'Invalid token!' });
  }

  // send to the next endpoint
  next();
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: '2h' });
};

module.exports = { authMiddleware, signToken };

