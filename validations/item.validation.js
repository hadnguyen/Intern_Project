const Joi = require('joi');

const itemSchema = Joi.object({
  name: Joi.string().required(),
  barcode: Joi.string().required(),
  costPrice: Joi.number().integer().positive().required(),
  sellingPrice: Joi.number().integer().positive().required(),
  weight: Joi.number().positive(),
  soldQuantity: Joi.number().integer().positive(),
  description: Joi.string(),
  image: Joi.string(),
  imageList: Joi.array().items(Joi.string()),
  categoryId: Joi.number().required(),
});

module.exports = {
  itemSchema,
};
