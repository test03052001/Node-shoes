const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = path.join(process.cwd(), 'logs');
const logFile = process.env.LOG_FILE || path.join(logDir, 'app.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      return stack ? `${base}\n${stack}` : base;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: logFile,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 1,
      tailable: true,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
