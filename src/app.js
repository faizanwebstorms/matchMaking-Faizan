const express = require('express');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');
const { socketConnection } = require('./utils/socket');
const socketMiddleware = require('./middlewares/socket');

mongoose.set('strictQuery', true);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

const app = express();

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});
const io = socketConnection(server);

app.use(socketMiddleware(io));

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Increase request entity
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());



// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);
// app.get('/', function (req, res) {
//   res.redirect('/v1/docs');
// });



app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

module.exports = app;
