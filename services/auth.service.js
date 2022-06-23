const { User } = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
  try {
    data.password = await bcrypt.hash(data.password, 12);
    const newUser = await User.create(data);

    return newUser;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Please provide email and password', 401);
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  return user;
};

module.exports = {
  createUser,
  loginUser,
  createSendToken,
};
