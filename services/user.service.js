const { User } = require('../models/index');
const AppError = require('../utils/appError');

const findAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

const findUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  return user;
};

const updateUserById = async (userId, data) => {
  await User.update(data, {
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

const deleteUserById = async (userId) => {
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
  findAllUsers,
  findUser,
  updateUserById,
  deleteUserById,
};
