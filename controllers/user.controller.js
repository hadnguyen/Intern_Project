const { User } = require('../models/index');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.findAll();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updateUser = catchAsync(async (req, res) => {
  await User.update(req.body, {
    where: {
      id: req.params.id,
    },
  });

  const user = await User.findOne({ where: { id: req.params.id } });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await User.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
