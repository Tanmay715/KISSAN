const { AppError } = require('../utils/errors');

function error_handler(err, req, res, next) {
  const status_code = err.status_code || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status_code).json({
    success: false,
    message,
  });
}

function not_found_handler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404));
}

module.exports = { error_handler, not_found_handler };
