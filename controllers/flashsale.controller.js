const catchAsync = require('../utils/catchAsync');
const flashsaleService = require('../services/flashsale.service');

const getAllFlashSales = catchAsync(async (req, res) => {
  const flashsales = await flashsaleService.getAllFlashSales(req.query);
  const meta = {
    results: flashsales.rows.length,
    totalFlashSales: flashsales.count,
    totalPages: flashsales.totalPages,
    currentPage: flashsales.pageValue,
    pageSize: flashsales.limitValue,
  };

  res.status(200).json({
    status: 'success',
    meta: meta,
    data: flashsales.rows,
  });
});

const getFlashSale = catchAsync(async (req, res) => {
  const flashsale = await flashsaleService.getFlashSale(req.params.id);

  res.status(200).json({
    status: 'success',
    data: flashsale,
  });
});

const createFlashSale = catchAsync(async (req, res) => {
  const { flashsaleItems, flashsale } = await flashsaleService.createFlashSale(
    req.body
  );

  res.status(201).json({
    status: 'success',
    data: flashsale,
    detail: flashsaleItems,
  });
});

const updateFlashSale = catchAsync(async (req, res) => {
  const flashsale = await flashsaleService.updateFlashSale(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: flashsale,
  });
});

const deleteFlashSale = catchAsync(async (req, res) => {
  await flashsaleService.deleteFlashSale(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllFlashSales,
  getFlashSale,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
};
