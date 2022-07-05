const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(voucherController.getAllVouchers)
  .post(voucherController.createVoucher);

router
  .route('/:id')
  .get(voucherController.getVoucher)
  .patch(voucherController.updateVoucher)
  .delete(voucherController.deleteVoucher);

module.exports = router;
