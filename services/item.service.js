const { Item, Category, Media, FlashSale } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');
const cloudinary = require('../utils/cloudinary');

const getAllItems = async (queryString, categoryId) => {
  try {
    const items = await ApiFeatures(Item, queryString, categoryId);
    return items;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const getItem = async (itemId) => {
  const item = await Item.findOne({
    where: { id: itemId },
    include: [{ model: Category }, { model: Media }, { model: FlashSale }],
  });

  if (!item) {
    throw new AppError('No item found with that ID', 404);
  }

  return item;
};

const createItem = async (itemBody, file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'VMO_Project/Item',
      use_filename: true,
    });
    const newItem = { ...itemBody };
    const excludedFields = ['mediaName', 'type'];
    excludedFields.forEach((field) => {
      delete newItem[field];
    });

    const item = await Item.create(newItem);
    const media = await Media.create({
      name: itemBody.mediaName,
      url: result.secure_url,
      type: itemBody.type,
      itemId: item.id,
    });

    return { item, media };
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const updateItem = async (itemId, itemBody) => {
  const item = await Item.findOne({ where: { id: itemId } });

  if (!item) {
    throw new AppError('No item found with that ID', 404);
  }

  try {
    await Item.update(itemBody, {
      where: {
        id: itemId,
      },
    });
    await item.reload();
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }

  return item;
};

const deleteItem = async (itemId) => {
  const isDeleted = await Item.destroy({
    where: {
      id: itemId,
    },
  });

  if (!isDeleted) {
    throw new AppError('No item found with that ID', 404);
  }
};

module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
