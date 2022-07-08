const Joi = require('joi');

const orderSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  telephone: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid('new', 'in progress', 'completed', 'canceled'),
  items: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().required(),
      quantity: Joi.number().integer().required(),
    })
  ),
  voucherId: Joi.number().integer(),
});

module.exports = {
  orderSchema,
};
