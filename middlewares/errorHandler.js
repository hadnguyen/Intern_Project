const AppError = require('../utils/appError');

const sendError = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    //   stack: err.stack,
  });
};

const handleSequelizeUniqueConstraintError = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid input data: ${errors.join('.')}`;
  return new AppError(message, 400);
};

const handleSequelizeValidationError = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const message = `NotNull Violation: ${errors.join('.')}`;
  return new AppError(message, 400);
};

const handleSequelizeDatabaseError = (err) => {
  const message = err.message;
  return new AppError(message, 400);
};

const handleSequelizeForeignKeyConstraintError = (err) => {
  const message = err.original.detail;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (err.name === 'SequelizeUniqueConstraintError')
    error = handleSequelizeUniqueConstraintError(error);

  if (err.name === 'SequelizeValidationError')
    error = handleSequelizeValidationError(error);

  if (err.name === 'SequelizeDatabaseError')
    error = handleSequelizeDatabaseError(error);

  if (err.name === 'SequelizeForeignKeyConstraintError')
    error = handleSequelizeForeignKeyConstraintError(error);

  sendError(error, req, res);
};
