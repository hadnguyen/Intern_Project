const { User } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');

const getAllUsers = async (queryString) => {
  const users = await ApiFeatures(User, queryString);
  return users;
};

const getUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  return user;
};

const updateUser = async (userId, userBody) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  try {
    await User.update(userBody, {
      where: {
        id: userId,
      },
    });
    await user.reload();
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }

  return user;
};

const deleteUser = async (userId) => {
  const isDeleted = await User.destroy({
    where: {
      id: userId,
    },
  });

  if (!isDeleted) {
    throw new AppError('No user found with that ID', 404);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
