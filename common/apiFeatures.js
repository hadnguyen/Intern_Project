const { Op } = require('sequelize');
const {
  User,
  Item,
  Voucher,
  Category,
  Media,
  FlashSale,
} = require('../models/index');

const ApiFeatures = async (model, queryString, id) => {
  let filter = {};
  let attributeValues;
  let limitValue = 5;
  let pageValue = 1;
  const sortValueArray = [];

  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  if (Object.keys(queryObj).length !== 0) {
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // filter = JSON.parse(queryStr);
    filter = queryObj;
  }

  if (id && model.name == 'Item') {
    filter.categoryId = id;
  }

  if (queryString.fields) {
    attributeValues = queryString.fields.split(',');
  }

  if (queryString.sort) {
    let direction = 'ASC';
    if (queryString.sort.startsWith('-')) {
      queryString.sort = queryString.sort.slice(1);
      direction = 'DESC';
    }
    sortValueArray.push([queryString.sort, direction]);
  }

  if (queryString.limit) {
    limitValue = +queryString.limit;
  }

  if (queryString.page) {
    pageValue = +queryString.page;
  }

  const skip = (pageValue - 1) * limitValue;

  let result;

  if (model.name === 'Item') {
    result = await model.findAndCountAll({
      attributes: attributeValues,
      where: filter,
      include: [{ model: Category }, { model: Media }],
      order: sortValueArray,
      limit: limitValue,
      offset: skip,
    });
  }

  if (model.name === 'User') {
    result = await model.findAndCountAll({
      attributes: attributeValues,
      where: filter,
      order: sortValueArray,
      limit: limitValue,
      offset: skip,
    });
  }

  if (model.name === 'Category') {
    result = await model.findAndCountAll({
      attributes: attributeValues,
      where: filter,
      order: sortValueArray,
      limit: limitValue,
      offset: skip,
    });
  }

  if (model.name === 'Media') {
    result = await model.findAndCountAll({
      attributes: attributeValues,
      where: filter,
      order: sortValueArray,
      limit: limitValue,
      offset: skip,
    });
  }

  if (model.name === 'Voucher') {
    result = await model.findAndCountAll({
      attributes: attributeValues,
      where: filter,
      order: sortValueArray,
      limit: limitValue,
      offset: skip,
    });
  }

  if (model.name === 'FlashSale') {
    result = await model.findAndCountAll({
      attributes: attributeValues,
      where: filter,
      include: Item,
      order: sortValueArray,
      limit: limitValue,
      offset: skip,
    });
  }

  if (model.name === 'Order') {
    result = await model.findAndCountAll({
      distinct: true,
      attributes: attributeValues,
      where: filter,
      include: [
        {
          model: Item,
          attributes: ['id', 'name', 'sellingPrice'],
          include: [
            { model: Category, attributes: ['name'] },
            { model: FlashSale },
          ],
        },
        { model: User, attributes: ['name', 'email'] },
        { model: Voucher },
      ],
      order: sortValueArray,
      limit: limitValue,
      offset: skip,
    });
  }

  const rows = result.rows;
  const count = result.count;
  const totalPages = Math.ceil(count / limitValue);
  return { rows, count, totalPages, pageValue, limitValue };
};

module.exports = ApiFeatures;
