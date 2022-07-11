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
        include: Category,
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
          console.log(validFlashSale[0].toJSON());

          // Check flashsale is valid or not
          if (validFlashSale.length === 0) {
            total += orderBody.items[index].quantity * sellingPrice;
          } else {
            const usedFlashSale = validFlashSale[0].FlashSale_Item;
            const discountPercent = usedFlashSale.discountPercent.replace(
              '%',
              ''
            );

            // Check the number of purchases is more than the number of flashsale or not
            const flashSaleQuantity =
              orderBody.items[index].quantity > usedFlashSale.quantity
                ? usedFlashSale.quantity
                : orderBody.items[index].quantity;

            const normalQuantity =
              orderBody.items[index].quantity - flashSaleQuantity;

            total +=
              flashSaleQuantity *
                (sellingPrice * (100 - discountPercent) * 0.01) +
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
          const discountPercent = voucher.discountPercent.replace('%', '');
          total = total - (total * discountPercent) / 100;
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

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
};
