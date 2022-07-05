const { Order, Item, OrderDetail } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');

const getAllOrders = async (queryString) => {
  try {
    const orders = await ApiFeatures(Order, queryString);
    return orders;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const getOrder = async (orderId) => {
  const order = await Order.findOne({ where: { id: orderId } });

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  return order;
};

const createOrder = async (orderBody, item, userId) => {
  try {
    // const order = await Order.create(orderBody);
    // return order;
    const { item: itemId, quantity } = item;
    const orderedItem = await Item.findOne({ where: { id: itemId } });

    let total = orderedItem.sellingPrice * quantity;
    orderBody.userId = userId;
    orderBody.total = total;

    const order = await Order.create(orderBody);

    // console.log('orderId: ', order.id);
    // console.log('itemId: ', itemId);

    const { id: orderId } = order;

    const orderDetail = await OrderDetail.create({
      OrderId: orderId,
      ItemId: itemId,
      price: orderedItem.sellingPrice,
      quantity: quantity,
    });

    // console.log(orderDetail);

    orderedItem.inventoryQuantity -= quantity;
    orderedItem.soldQuantity += quantity;

    await orderedItem.save({
      fields: ['inventoryQuantity', 'soldQuantity'],
    });

    return { order, orderDetail };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateOrder = async (orderId, orderBody) => {
  const order = await Order.findOne({ where: { id: orderId } });

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  try {
    await Order.update(orderBody, {
      where: {
        id: orderId,
      },
    });
    await order.reload();
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }

  return order;
};

const deleteOrder = async (orderId) => {
  const isDeleted = await Order.destroy({
    where: {
      id: orderId,
    },
  });

  if (!isDeleted) {
    throw new AppError('No voucher found with that ID', 404);
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};
