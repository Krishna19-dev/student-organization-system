class AppError extends Error {
  constructor(status, code, message, details = {}) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const badRequest = (code, message, details = {}) => new AppError(400, code, message, details);
const unauthorized = (code = 'UNAUTHORIZED', message = 'Authentication required', details = {}) =>
  new AppError(401, code, message, details);
const forbidden = (code = 'FORBIDDEN', message = 'Permission denied', details = {}) =>
  new AppError(403, code, message, details);
const notFound = (code = 'NOT_FOUND', message = 'Resource not found', details = {}) =>
  new AppError(404, code, message, details);
const conflict = (code = 'CONFLICT', message = 'Conflict detected', details = {}) =>
  new AppError(409, code, message, details);

module.exports = {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};
