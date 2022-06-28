const { Category } = require('../models/index');
const AppError = require('../utils/appError');

const createCategory = async (categoryBody) => {
  const category = await Category.create(categoryBody);

  return category;
};

const getAllCategories = async () => {
  const categories = await Category.findAll({ raw: true });
  return categories;
};

const getCategory = async (categoryId) => {
  const category = await Category.findOne({ where: { id: categoryId } });
  return category;
};

const updateCategory = async (categoryId, categoryBody) => {
  await Category.update(categoryBody, {
    where: {
      id: categoryId,
    },
  });

  const category = await Category.findOne({ where: { id: categoryId } });

  if (!category) {
    throw new AppError('No category found with that ID', 404);
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  const isDelete = await Category.destroy({
    where: {
      id: categoryId,
    },
  });

  if (!isDelete) {
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
