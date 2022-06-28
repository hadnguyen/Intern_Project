const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategory(req.params.id);
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const categories = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  res.status(200).json({
    status: 'success',
    data: categories,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
