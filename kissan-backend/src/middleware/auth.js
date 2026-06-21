const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors');

function authenticate(req, res, next) {
  const auth_header = req.headers.authorization;

  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = auth_header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }

    return next();
  };
}

module.exports = { authenticate, authorize };
