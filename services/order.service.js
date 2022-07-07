const { sequelize } = require('../models/index');
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

const createOrder = async (orderBody, userId) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let total;

      const orderedItem = await Promise.all(
        orderBody.items.map(
          async (item) => await Item.findOne({ where: { id: item.id } })
        )
      );

      if (Object.keys(orderedItem).length === 0)
        throw new AppError('Please choose items to order', 400);

      // Buy 1 item or many items
      if (Object.keys(orderedItem).length === 1) {
        total = +orderedItem[0].sellingPrice * +orderBody.items[0].quantity;
      } else {
        total = orderedItem.reduce((acc, item, index) => {
          const sum =
            +acc.sellingPrice * orderBody.items[index - 1].quantity +
            +item.sellingPrice * orderBody.items[index].quantity;

          return sum;
        });
      }

      orderBody.userId = userId;
      orderBody.total = total;

      const order = await Order.create(orderBody, { transaction: t });
      const { id: orderId } = order;

      const orderDetails = await Promise.all(
        orderedItem.map(
          async (item, index) =>
            await OrderDetail.create(
              {
                OrderId: orderId,
                ItemId: item.id,
                price: item.sellingPrice,
                quantity: orderBody.items[index].quantity,
              },
              { transaction: t }
            )
        )
      );

      await Promise.all(
        orderedItem.map(async (item, index) => {
          item.inventoryQuantity -= orderBody.items[index].quantity;
          item.soldQuantity += orderBody.items[index].quantity;

          return await item.save({ transaction: t });
        })
      );

      return { order, orderDetails };
    });
    return result;
  } catch (error) {
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
