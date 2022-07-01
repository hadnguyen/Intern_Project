const express = require('express');
const itemController = require('../controllers/item.controller');
const authController = require('../controllers/auth.controller');
const itemValidation = require('../validations/item.validation');
const validate = require('../middlewares/validate');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(itemController.getAllItems)
  .post(validate(itemValidation.itemSchema, 'body'), itemController.createItem);

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
