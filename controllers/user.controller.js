const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);

  res.status(200).json({
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
