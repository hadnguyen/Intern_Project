const catchAsync = require('../utils/catchAsync');
const itemService = require('../services/item.service');

const getAllItems = catchAsync(async (req, res) => {
  const items = await itemService.getAllItems(req.query, req.params.categoryId);
  const meta = {
    results: items.rows.length,
    totalItems: items.count,
    totalPages: items.totalPages,
    currentPage: items.pageValue,
    pageSize: items.limitValue,
  };

  res.status(200).json({
    status: 'success',
    meta: meta,
    data: items.rows,
  });
});

const getItem = catchAsync(async (req, res) => {
  const item = await itemService.getItem(req.params.id);

  res.status(200).json({
    status: 'success',
    data: item,
  });
});

const createItem = catchAsync(async (req, res) => {
  const item = await itemService.createItem(req.body);

  res.status(201).json({
    status: 'success',
    data: item,
  });
});

const updateItem = catchAsync(async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: item,
  });
});

const deleteItem = catchAsync(async (req, res) => {
  await itemService.deleteItem(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
