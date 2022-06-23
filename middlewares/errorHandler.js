const AppError = require('../utils/appError');

const sendError = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    // error: err,
    message: err.message,
    //   stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  sendError(error, req, res);
};
