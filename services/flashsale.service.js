const { sequelize } = require('../models/index');
const { Item, FlashSale, FlashSale_Item, User } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');
const CronJob = require('cron').CronJob;
const Email = require('../utils/email');

const getAllFlashSales = async (queryString) => {
  try {
    const flashsales = await ApiFeatures(FlashSale, queryString);
    return flashsales;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const getFlashSale = async (flashsaleId) => {
  const flashsale = await FlashSale.findOne({
    where: { id: flashsaleId },
    include: Item,
  });

  if (!flashsale) {
    throw new AppError('No flashsale found with that ID', 404);
  }

  return flashsale;
};

const createFlashSale = async (flashsaleBody) => {
  const { flashsales, startDate, endDate } = flashsaleBody;

  const itemsNeedToAddFlashSale = await Promise.all(
    flashsales.map(
      async (item) => await Item.findOne({ where: { id: item.itemId } })
    )
  );

  const notHaveItems = itemsNeedToAddFlashSale.some((item) => item === null);
  if (notHaveItems) throw new AppError('No item found with that ID', 404);

  const notEnoughItems = itemsNeedToAddFlashSale.some(
    (item, index) => item.inventoryQuantity < flashsales[index].quantity
  );
  if (notEnoughItems) throw new AppError('Do not have enough items', 400);

  try {
    const result = await sequelize.transaction(async (t) => {
      let flashsaleItems;
      const flashsale = await FlashSale.create(
        {
          startDate: startDate,
          endDate: endDate,
        },
        { transaction: t }
      );

      // Get all items have flashsale from flashsale body
      let itemsHadFlashSale = await Promise.all(
        flashsales.map(
          async (fs) =>
            await FlashSale_Item.findOne({
              where: { ItemId: fs.itemId },
            })
        )
      );

      // If all items do not have flashsale before, then create
      if (itemsHadFlashSale.every((item) => item === null)) {
        flashsaleItems = await Promise.all(
          itemsNeedToAddFlashSale.map(
            async (item, index) =>
              await FlashSale_Item.create(
                {
                  FlashSaleId: flashsale.id,
                  ItemId: item.id,
                  quantity: flashsales[index].quantity,
                  discountPercent: flashsales[index].discountPercent,
                },
                { transaction: t }
              )
          )
        );
      } else {
        itemsHadFlashSale = itemsHadFlashSale.filter((item) => item !== null);
        const existedFlashSale = await Promise.all(
          itemsHadFlashSale.map(
            async (item) =>
              await FlashSale.findOne({ where: { id: item.FlashSaleId } })
          )
        );

        if (existedFlashSale.some((fs) => fs.endDate > flashsale.startDate)) {
          throw new AppError('Item is available during flashsale time', 400);
        } else {
          flashsaleItems = await Promise.all(
            itemsNeedToAddFlashSale.map(
              async (item, index) =>
                await FlashSale_Item.create(
                  {
                    FlashSaleId: flashsale.id,
                    ItemId: item.id,
                    quantity: flashsales[index].quantity,
                    discountPercent: flashsales[index].discountPercent,
                  },
                  { transaction: t }
                )
            )
          );
        }
      }

      // Send email notification for flashsale
      const users = await User.findAll({ where: { role: 'user' } });
      let notificationTime = new Date(startDate);
      notificationTime.setMinutes(notificationTime.getMinutes() - 1);

      const job = new CronJob(notificationTime, async () => {
        await Promise.all(
          users.map(async (user) => {
            const flashsaleEmail = new Email(user, '', startDate);
            await flashsaleEmail.sendFlashSale();
          })
        );
      });
      job.start();

      return { flashsaleItems, flashsale };
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const updateFlashSale = async (flashsaleId, flashsaleBody) => {
  const flashsale = await FlashSale.findOne({
    where: { id: flashsaleId },
  });

  if (!flashsale) {
    throw new AppError('No flashsale found with that ID', 404);
  }

  try {
    await FlashSale.update(flashsaleBody, {
      where: {
        id: flashsaleId,
      },
    });
    await flashsale.reload();
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }

  return flashsale;
};

const deleteFlashSale = async (flashsaleId) => {
  const isDeleted = await FlashSale.destroy({
    where: {
      id: flashsaleId,
    },
  });

  if (!isDeleted) {
    throw new AppError('No flashsale found with that ID', 404);
  }
};

module.exports = {
  getAllFlashSales,
  getFlashSale,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
};
