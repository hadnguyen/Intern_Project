const { User } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');
const cloudinary = require('../utils/cloudinary');

const getAllUsers = async (queryString) => {
  try {
    const users = await ApiFeatures(User, queryString);
    return users;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
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

// const deleteUser = async (userId) => {
//   const isDeleted = await User.destroy({
//     where: {
//       id: userId,
//     },
//   });

//   if (!isDeleted) {
//     throw new AppError('No user found with that ID', 404);
//   }
// };

const deleteUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  user.status = 'inactive';
  await user.save({ fields: ['status'] });
};

const updateUserPhoto = async (userId, file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'VMO_Project/Avatar',
      use_filename: true,
    });

    await User.update(
      { photo: result.secure_url },
      {
        where: {
          id: userId,
        },
      }
    );

    const user = await User.findOne({
      attributes: ['id', 'email', 'name', 'photo'],
      where: { id: userId },
    });

    return user;
  } catch (error) {
    // throw new AppError('Internal server error', 500);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPhoto,
};
