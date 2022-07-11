const Joi = require('joi');

const itemSchema = Joi.object({
  name: Joi.string().required(),
  barcode: Joi.string().required(),
  costPrice: Joi.number().integer().positive().required(),
  sellingPrice: Joi.number().integer().positive().required(),
  weight: Joi.number().positive(),
  inventoryQuantity: Joi.number().integer().positive(),
  description: Joi.string(),
  categoryId: Joi.number().required(),
  mediaName: Joi.string(),
});

module.exports = {
  itemSchema,
};
