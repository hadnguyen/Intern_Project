const Joi = require('joi');

// const loginSchema = {
//   body: Joi.object().keys({
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//   }),
// };

// const logoutSchema = {
//   body: Joi.object().keys({
//     accessToken: Joi.string().required(),
//     refreshToken: Joi.string().required(),
//   }),
// };

// const registerSchema = {
//   body: Joi.object().keys({
//     displayName: Joi.string().required(),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().custom(password),
//   }),
// };

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  role: Joi.string(),
});

module.exports = {
  //   loginSchema,
  //   logoutSchema,
  //   registerSchema,
  signupSchema,
};
