const { Category, Item } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');
const cloudinary = require('../utils/cloudinary');

const getAllCategories = async (queryString) => {
  try {
    const categories = await ApiFeatures(Category, queryString);
    return categories;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const getCategory = async (categoryId) => {
  const category = await Category.findOne({ where: { id: categoryId } });

  if (!category) {
    throw new AppError('No category found with that ID', 404);
  }

  return category;
};

const createCategory = async (categoryBody, files) => {
  try {
    const urls = [];

    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const { path } = file;
          const newPath = await cloudinary.uploader.upload(path, {
            folder: 'VMO_Project/Category',
            use_filename: true,
          });
          urls.push(newPath.secure_url);
        })
      );

      categoryBody.banner = urls;
    }

    const category = await Category.create(categoryBody);
    return category;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const updateCategory = async (categoryId, categoryBody, files) => {
  const urls = [];

  const category = await Category.findOne({ where: { id: categoryId } });

  if (!category) {
    throw new AppError('No category found with that ID', 404);
  }

  try {
    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const { path } = file;
          const newPath = await cloudinary.uploader.upload(path, {
            folder: 'VMO_Project/Category',
            use_filename: true,
          });
          urls.push(newPath.secure_url);
        })
      );

      categoryBody.banner = urls;
    }

    await Category.update(categoryBody, {
      where: {
        id: categoryId,
      },
    });
    await category.reload();
  } catch (error) {
    // throw new AppError('Internal server error', 500);
    throw error;
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  const isDeleted = await Category.destroy({
    where: {
      id: categoryId,
    },
  });

  if (!isDeleted) {
    throw new AppError('No category found with that ID', 404);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
