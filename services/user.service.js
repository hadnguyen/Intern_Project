const { User } = require('../models/index');
const AppError = require('../utils/appError');

const getAllUsers = async () => {
  const users = await User.findAll();
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
  await User.update(userBody, {
    where: {
      id: userId,
    },
  });

  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  return user;
};

const deleteUser = async (userId) => {
  const isDelete = await User.destroy({
    where: {
      id: userId,
    },
  });

  if (!isDelete) {
    throw new AppError('No user found with that ID', 404);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
