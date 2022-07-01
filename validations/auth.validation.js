const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
  role: Joi.string().valid('user', 'admin'),
  address: Joi.string(),
  telephone: Joi.string(),
  photo: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  signupSchema,
  loginSchema,
};
