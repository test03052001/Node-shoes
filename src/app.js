const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const requestLogger = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
