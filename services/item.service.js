const { Item } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');

const getAllItems = async (queryString) => {
  const items = await ApiFeatures(Item, queryString);

  return items;
};

const getItem = async (itemId) => {
  const item = await Item.findOne({ where: { id: itemId } });

  if (!item) {
    throw new AppError('No item found with that ID', 404);
  }

  return item;
};

const createItem = async (itemBody) => {
  const item = await Item.create(itemBody);

  return item;
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
