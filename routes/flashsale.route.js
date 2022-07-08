const express = require('express');
const flashsaleController = require('../controllers/flashsale.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(flashsaleController.getAllFlashSales)
  .post(flashsaleController.createFlashSale);

router
  .route('/:id')
  .get(flashsaleController.getFlashSale)
  .patch(flashsaleController.updateFlashSale);

module.exports = router;
