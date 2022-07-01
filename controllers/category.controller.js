const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories(req.query);

  res.status(200).json({
    status: 'success',
    results: categories.rows.length,
    totalCategories: categories.count,
    totalPages: categories.totalPages,
    currentPage: categories.pageValue,
    pageSize: categories.limitValue,
    data: categories.rows,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategory(req.params.id);

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    status: 'success',
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: category,
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
