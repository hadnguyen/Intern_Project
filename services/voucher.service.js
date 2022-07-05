const { Voucher } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');

const getAllVouchers = async (queryString) => {
  try {
    const vouchers = await ApiFeatures(Voucher, queryString);
    return vouchers;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const getVoucher = async (voucherId) => {
  const voucher = await Voucher.findOne({ where: { id: voucherId } });

  if (!voucher) {
    throw new AppError('No voucher found with that ID', 404);
  }

  return voucher;
};

const createVoucher = async (voucherBody) => {
  try {
    const voucher = await Voucher.create(voucherBody);
    return voucher;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const updateVoucher = async (voucherId, voucherBody) => {
  const voucher = await Voucher.findOne({ where: { id: voucherId } });
  console.log(voucherBody);

  if (!voucher) {
    throw new AppError('No voucher found with that ID', 404);
  }

  try {
    await Voucher.update(voucherBody, {
      where: {
        id: voucherId,
      },
    });
    await voucher.reload();
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }

  return voucher;
};

const deleteVoucher = async (voucherId) => {
  const isDeleted = await Voucher.destroy({
    where: {
      id: voucherId,
    },
  });

  if (!isDeleted) {
    throw new AppError('No voucher found with that ID', 404);
  }
};

module.exports = {
  getAllVouchers,
  getVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
