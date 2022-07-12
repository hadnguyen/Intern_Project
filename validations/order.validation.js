const Joi = require('joi');

const orderSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  telephone: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid('new', 'in progress', 'completed', 'canceled'),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().required(),
        quantity: Joi.number().integer().required(),
      })
    )
    .required(),
  voucherId: Joi.number().integer(),
});

const updatedOrderSchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  telephone: Joi.string(),
  email: Joi.string().email(),
  status: Joi.string().valid('new', 'in progress', 'completed', 'canceled'),
});

module.exports = {
  orderSchema,
  updatedOrderSchema,
};
