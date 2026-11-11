const jwt = require('jsonwebtoken');
const {UnauthorizedError} = require('../utils/errors');
const authenticate = (req, res, next) => {
  const cookies = req.cookies;
  if (cookies && cookies.accessToken) {
    req.headers.authorization = `Bearer ${cookies.accessToken}`;
  }
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader ? authHeader.split(' ') : [null, null];

  if (scheme !== 'Bearer') {
    throw new UnauthorizedError("Access denied. Invalid token format.");
  }
  if (!token) {
    throw new UnauthorizedError("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) { 
    next(error);
  }
};

module.exports = { authenticate };