const express = require('express');
const flashsaleController = require('../controllers/flashsale.controller');
const authController = require('../controllers/auth.controller');
const flashsaleValidation = require('../validations/flashsale.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(flashsaleController.getAllFlashSales)
  .post(
    validate(flashsaleValidation.flashsaleSchema, 'body'),
    flashsaleController.createFlashSale
  );

router
  .route('/:id')
  .get(flashsaleController.getFlashSale)
  .patch(
    validate(flashsaleValidation.updatedFlashsaleSchema, 'body'),
    flashsaleController.updateFlashSale
  )
  .delete(flashsaleController.deleteFlashSale);

module.exports = router;
