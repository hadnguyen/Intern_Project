const express = require('express');
const orderController = require('../controllers/order.controller');
const authController = require('../controllers/auth.controller');
const orderValidation = require('../validations/order.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(
    validate(orderValidation.orderSchema, 'body'),
    orderController.createOrder
  );

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(
    validate(orderValidation.updatedOrderSchema, 'body'),
    orderController.updateOrder
  );

module.exports = router;
