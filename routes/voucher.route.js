const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const authController = require('../controllers/auth.controller');
const voucherValidation = require('../validations/voucher.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(voucherController.getAllVouchers)
  .post(
    validate(voucherValidation.voucherSchema, 'body'),
    voucherController.createVoucher
  );

router
  .route('/:id')
  .get(voucherController.getVoucher)
  .patch(
    validate(voucherValidation.updatedVoucherSchema, 'body'),
    voucherController.updateVoucher
  )
  .delete(voucherController.deleteVoucher);

module.exports = router;
