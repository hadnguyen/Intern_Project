const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order.service');

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders(req.query);
  const meta = {
    results: orders.rows.length,
    totalOrders: orders.count,
    totalPages: orders.totalPages,
    currentPage: orders.pageValue,
    pageSize: orders.limitValue,
  };

  res.status(200).json({
    status: 'success',
    meta: meta,
    data: orders.rows,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrder(req.params.id);

  res.status(200).json({
    status: 'success',
    data: order,
  });
});

const createOrder = catchAsync(async (req, res) => {
  const { order, orderDetails } = await orderService.createOrder(
    req.body,
    req.user.id
  );

  res.status(201).json({
    status: 'success',
    data: order,
    detail: orderDetails,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: order,
  });
});

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
};
