require('dotenv').config();

const app = require('./app');
const logger = require('./config/logger');

require('./config/database');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Shoes Store API started on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}\n${err.stack || ''}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  if (reason instanceof Error) {
    logger.error(`Unhandled Rejection: ${reason.message}\n${reason.stack || ''}`);
  } else {
    logger.error(`Unhandled Rejection: ${String(reason)}`);
  }
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});
