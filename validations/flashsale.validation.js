const Joi = require('joi');

const flashsaleSchema = Joi.object({
  flashsales: Joi.array()
    .items(
      Joi.object({
        discountPercent: Joi.number().greater(0).less(1).required(),
        quantity: Joi.number().integer().required(),
        itemId: Joi.number().required(),
      })
    )
    .required(),

  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

const updatedFlashsaleSchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date(),
  quantity: Joi.number().integer(),
});

module.exports = {
  flashsaleSchema,
  updatedFlashsaleSchema,
};
