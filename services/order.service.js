const { sequelize } = require('../models/index');
const {
  Order,
  Item,
  OrderDetail,
  Voucher,
  Category,
  User,
  FlashSale,
  FlashSale_Item,
} = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');
const { Op } = require('sequelize');

const getAllOrders = async (queryString) => {
  try {
    const orders = await ApiFeatures(Order, queryString);
    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrder = async (orderId) => {
  const order = await Order.findOne({
    where: { id: orderId },
    include: [
      {
        model: Item,
        include: [{ model: Category }, { model: FlashSale }],
      },
      { model: User },
      { model: Voucher },
    ],
  });

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  return order;
};

const createOrder = async (orderBody, userId) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let total = 0;

      // Find all items
      const orderedItem = await Promise.all(
        orderBody.items.map(
          async (item) =>
            await Item.findOne({ where: { id: item.id }, include: FlashSale })
        )
      );

      if (orderedItem.length === 0)
        throw new AppError('Please choose items to order', 400);

      if (orderedItem.some((item) => item === null))
        throw new AppError('No item found with that ID', 404);

      const notEnoughItems = orderedItem.some(
        (item, index) =>
          item.inventoryQuantity < orderBody.items[index].quantity
      );
      if (notEnoughItems) throw new AppError('Do not have enough items', 400);

      for (let index = 0; index < orderedItem.length; index++) {
        const { sellingPrice, FlashSales } = orderedItem[index];

        // Check item have flashsale or not
        if (FlashSales.length) {
          const validFlashSale = FlashSales.filter(
            (fs) => fs.endDate > Date.now() && fs.FlashSale_Item.quantity
          );

          // Check flashsale is valid or not
          if (validFlashSale.length === 0) {
            total += orderBody.items[index].quantity * sellingPrice;
          } else {
            const usedFlashSale = validFlashSale[0].FlashSale_Item;

            // Check the number of purchases is more than the number of flashsale or not
            const flashSaleQuantity =
              orderBody.items[index].quantity > usedFlashSale.quantity
                ? usedFlashSale.quantity
                : orderBody.items[index].quantity;

            const normalQuantity =
              orderBody.items[index].quantity - flashSaleQuantity;

            total +=
              flashSaleQuantity *
                (sellingPrice * (1 - usedFlashSale.discountPercent)) +
              normalQuantity * sellingPrice;

            // Reduce the number of items have flashsale
            usedFlashSale.quantity -= flashSaleQuantity;
            await usedFlashSale.save({ transaction: t });
          }
        } else {
          total += orderBody.items[index].quantity * sellingPrice;
        }
      }

      // Check order whether it has voucher or not
      if (orderBody.voucherId) {
        const voucher = await Voucher.findOne({
          where: { id: orderBody.voucherId },
        });
        if (!voucher || voucher.quantity === 0)
          throw new AppError('No voucher found with that ID', 404);

        if (voucher.endDate < Date.now()) {
          throw new AppError('The voucher is invalid or has expired', 400);
        } else {
          total = total * (1 - voucher.discountPercent);
          voucher.quantity -= 1;
          await voucher.save({ transaction: t });
        }
      }

      orderBody.userId = userId;
      orderBody.total = total;

      // Create order
      const order = await Order.create(orderBody, { transaction: t });
      const { id: orderId } = order;

      // Create order details
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
  const order = await Order.findOne({
    where: { id: orderId },
    include: [
      {
        model: Item,
        include: FlashSale,
      },
      { model: Voucher },
    ],
  });

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  if (order.status === 'canceled' || order.status === 'completed')
    throw new AppError('Can not change order!', 400);

  try {
    if (orderBody.status === 'canceled') {
      const { voucherId, Items } = order;

      const result = await sequelize.transaction(async (t) => {
        for (let index = 0; index < Items.length; index++) {
          const {
            id: itemId,
            OrderDetail: orderDetail,
            FlashSales: flashSales,
          } = Items[index];

          // Update quantity in Item
          const item = await Item.findOne({ where: { id: itemId } });
          item.inventoryQuantity += orderDetail.quantity;
          item.soldQuantity -= orderDetail.quantity;
          await item.save({ transaction: t });

          // Update quantity in FlashSale
          const [flashSale] = flashSales;
          const flashSaleItem = await FlashSale_Item.findOne({
            where: {
              [Op.and]: [{ FlashSaleId: flashSale.id }, { ItemId: item.id }],
            },
          });
          flashSaleItem.quantity += orderDetail.quantity;
          await flashSaleItem.save({ transaction: t });
        }

        // Update quantity in Voucher
        const voucher = await Voucher.findOne({ where: { id: voucherId } });
        voucher.quantity += 1;
        await voucher.save({ transaction: t });

        await Order.update(
          orderBody,
          {
            where: {
              id: orderId,
            },
          },
          { transaction: t }
        );

        await order.reload();
        return order;
      });
      return result;
    } else {
      await Order.update(orderBody, {
        where: {
          id: orderId,
        },
      });

      await order.reload();
      return order;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
};
