const express = require('express');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const authValidation = require('../validations/auth.validation');
const validate = require('../middlewares/validate');
const router = express.Router();

router.post(
  '/signup',
  validate(authValidation.signupSchema, 'body'),
  authController.signup
);
router.post('/login', authController.login);

router.get('/verification/:token', authController.verifyEmail);

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
