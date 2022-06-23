const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const passport = require('passport');

const signup = catchAsync(async (req, res) => {
  const newUser = await authService.createUser(req.body);

  authService.createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUser(email, password);

  authService.createSendToken(user, 201, res);
});

const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user) {
    if (!err && !user) return next(new AppError('Please login to access', 401));
    req.user = user;
    next();
  })(req, res, next);
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Do not have permission', 403));
    }

    next();
  };
};

module.exports = {
  signup,
  login,
  restrictTo,
  protect,
};
