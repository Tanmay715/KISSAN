class AppError extends Error {
  constructor(message, status_code = 500) {
    super(message);
    this.status_code = status_code;
    this.name = 'AppError';
  }
}

module.exports = { AppError };
