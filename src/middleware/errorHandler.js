const logger = require('../config/logger');

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const logMessage = err.stack
    ? `${req.method} ${req.originalUrl} - ${statusCode}: ${message}\n${err.stack}`
    : `${req.method} ${req.originalUrl} - ${statusCode}: ${message}`;
  logger.error(logMessage);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { notFoundHandler, errorHandler };
