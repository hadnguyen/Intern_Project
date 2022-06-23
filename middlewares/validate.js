const AppError = require('../utils/appError');

module.exports = (schema, property) => {
  return (req, res, next) => {
    // property: params, body, query
    const { error } = schema.validate(req[property]);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');

      next(new AppError(message, 400));
    }
  };
};
