const { Op } = require('sequelize');

const ApiFeatures = async (model, queryString) => {
  let filter = {};
  let attributeValues;
  let limitValue = 5;
  let pageValue = 1;

  const orderValueArray = [];

  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  if (Object.keys(queryObj).length !== 0) {
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // filter = JSON.parse(queryStr);
    filter = queryObj;
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
    orderValueArray.push([queryString.sort, direction]);
  }

  if (queryString.limit) {
    limitValue = +queryString.limit;
  }

  if (queryString.page) {
    pageValue = +queryString.page;
  }

  const skip = (pageValue - 1) * limitValue;

  const { count, rows } = await model.findAndCountAll({
    attributes: attributeValues,
    where: filter,
    order: orderValueArray,
    limit: limitValue,
    offset: skip,
  });

  const totalPages = Math.ceil(count / limitValue);
  return { rows, count, totalPages, pageValue, limitValue };
};

module.exports = ApiFeatures;
