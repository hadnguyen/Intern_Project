const { Category, Item } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');

const getAllCategories = async (queryString) => {
  const categories = await ApiFeatures(Category, queryString);

  return categories;
};

const getCategory = async (categoryId) => {
  const category = await Category.findOne({ where: { id: categoryId } });

  if (!category) {
    throw new AppError('No category found with that ID', 404);
  }

  return category;
};

const createCategory = async (categoryBody) => {
  const category = await Category.create(categoryBody);
  return category;
};

const updateCategory = async (categoryId, categoryBody) => {
  const category = await Category.findOne({ where: { id: categoryId } });

  if (!category) {
    throw new AppError('No category found with that ID', 404);
  }

  try {
    await Category.update(categoryBody, {
      where: {
        id: categoryId,
      },
    });
    await category.reload();
  } catch (error) {
    throw new AppError('Internal server error', 500);
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
