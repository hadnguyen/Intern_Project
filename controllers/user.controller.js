const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  const meta = {
    results: users.rows.length,
    totalUsers: users.count,
    totalPages: users.totalPages,
    currentPage: users.pageValue,
    pageSize: users.limitValue,
  };

  res.status(200).json({
    status: 'success',
    meta: meta,
    data: users.rows,
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

const updateUserPhoto = catchAsync(async (req, res) => {
  const user = await userService.updateUserPhoto(req.user.id, req.file);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPhoto,
};
