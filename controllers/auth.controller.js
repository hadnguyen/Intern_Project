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

  authService.createSendToken(user, 200, res);
});

const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.confirmEmail(req.params.token);

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user) {
    if (!user) return next(new AppError('Please login to access', 401));
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

const forgotPassword = catchAsync(async (req, res) => {
  await authService.createResetPasswordToken(req.body.email);

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const user = await authService.resetPassword(
    req.params.token,
    req.body.password
  );
  authService.createSendToken(user, 200, res);
});

module.exports = {
  signup,
  login,
  restrictTo,
  protect,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
