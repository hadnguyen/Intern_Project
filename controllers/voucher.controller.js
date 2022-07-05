const catchAsync = require('../utils/catchAsync');
const voucherService = require('../services/voucher.service');

const getAllVouchers = catchAsync(async (req, res) => {
  const vouchers = await voucherService.getAllVouchers(req.query);
  const meta = {
    results: vouchers.rows.length,
    totalVouchers: vouchers.count,
    totalPages: vouchers.totalPages,
    currentPage: vouchers.pageValue,
    pageSize: vouchers.limitValue,
  };

  res.status(200).json({
    status: 'success',
    meta: meta,
    data: vouchers.rows,
  });
});

const getVoucher = catchAsync(async (req, res) => {
  const voucher = await voucherService.getVoucher(req.params.id);

  res.status(200).json({
    status: 'success',
    data: voucher,
  });
});

const createVoucher = catchAsync(async (req, res) => {
  const voucher = await voucherService.createVoucher(req.body);

  res.status(201).json({
    status: 'success',
    data: voucher,
  });
});

const updateVoucher = catchAsync(async (req, res) => {
  const voucher = await voucherService.updateVoucher(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: voucher,
  });
});

const deleteVoucher = catchAsync(async (req, res) => {
  await voucherService.deleteVoucher(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllVouchers,
  getVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
