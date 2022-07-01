const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().required(),
  priority: Joi.number().integer(),
  banner: Joi.array().items(Joi.string()),
  status: Joi.string().valid('active', 'inactive'),
});

module.exports = {
  categorySchema,
};
