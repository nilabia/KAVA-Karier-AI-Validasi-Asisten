const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('Token not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('Invalid token format');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Token not valid'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token has expired'));
    }
    next(error);
  }
};

module.exports = authMiddleware;