const { User } = require('../models/index');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const signEmailToken = (id) => {
  return jwt.sign({ id }, process.env.EMAIL_SECRET, { expiresIn: '1d' });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const comparePassword = async (inputPassword, userPassword) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

const createUser = async (userBody) => {
  try {
    userBody.password = await bcrypt.hash(userBody.password, 12);
    const newUser = await User.create(userBody);

    const emailToken = signEmailToken(newUser.id);
    const welcomeURL = 'http://127.0.0.1:3000/api/v1/users/profile';
    const verifyURL = `http://127.0.0.1:3000/api/v1/users/verification/${emailToken}`;

    const welcomeEmail = new Email(newUser, welcomeURL);
    const verifyEmail = new Email(newUser, verifyURL);

    await welcomeEmail.sendWelcome();
    await verifyEmail.sendVerifyEmail();

    return newUser;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const confirmEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
  let user = await User.findOne({ where: { id: decoded.id } });
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  try {
    await User.update({ isVerified: true }, { where: { id: decoded.id } });
    user = await User.findOne({ where: { id: decoded.id } });
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }

  return user;
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Please provide email and password', 401);
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  if (!user.isVerified)
    throw new AppError('Please verify your email to login', 401);

  if (user.status === 'inactive')
    throw new AppError('Your account had been locked', 401);

  return user;
};

const createResetPasswordToken = async (email) => {
  const user = await User.findOne({ where: { email: email } });
  if (!user) throw new AppError('Email is not exist!', 404);

  const resetToken = crypto.randomBytes(32).toString('hex');

  let resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  let resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Expire in 10 min

  user.set({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: resetPasswordExpire,
  });

  try {
    await user.save({ fields: ['resetPasswordToken', 'resetPasswordExpire'] });

    const resetURL = `http://127.0.0.1:3000/api/v1/users/resetPassword/${resetToken}`;
    const email = new Email(user, resetURL);
    await email.sendResetPassword();
  } catch (err) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save({ fields: ['resetPasswordToken', 'resetPasswordExpire'] });
    console.log('Error!!!!');
    throw new AppError('Error: sending the email', 500);
  }
};

const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      [Op.and]: [
        {
          resetPasswordToken: hashedToken,
        },
        { resetPasswordExpire: { [Op.gt]: Date.now() } },
      ],
    },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  try {
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save({
      fields: ['password', 'resetPasswordToken', 'resetPasswordExpire'],
    });
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }

  return user;
};

module.exports = {
  createUser,
  loginUser,
  createSendToken,
  confirmEmail,
  createResetPasswordToken,
  resetPassword,
};
