const { User } = require('../models/index');
const bcrypt = require('bcryptjs');
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

const createUser = async (data) => {
  data.password = await bcrypt.hash(data.password, 12);
  const newUser = await User.create(data);

  const emailToken = signEmailToken(newUser.id);
  const url = `http://127.0.0.1:3000/api/v1/users/verification/${emailToken}`;

  const email = new Email(newUser, url);
  await email.sendVerifyEmail();

  return newUser;
};

const confirmEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
  await User.update({ isVerify: true }, { where: { id: decoded.id } });
  const user = await User.findOne({ where: { id: decoded.id } });
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

  if (!user.isVerify)
    throw new AppError('Please verify your email to login', 401);

  return user;
};

module.exports = {
  createUser,
  loginUser,
  createSendToken,
  confirmEmail,
};
