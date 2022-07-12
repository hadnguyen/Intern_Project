const Joi = require('joi');

const voucherSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  discountPercent: Joi.number().greater(0).less(1).required(),
  quantity: Joi.number().integer().required(),
});

const updatedVoucherSchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date(),
  quantity: Joi.number().integer(),
});

module.exports = {
  voucherSchema,
  updatedVoucherSchema,
};
