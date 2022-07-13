const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const authController = require('../controllers/auth.controller');
const voucherValidation = require('../validations/voucher.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', voucherController.getAllVouchers);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post(
  '/',
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

/**
 * @swagger
 * components:
 *  schemas:
 *   Voucher:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *     startDate:
 *      type: string
 *      format: date
 *     endDate:
 *      type: string
 *      format: date
 *     discountPercent:
 *      type: integer
 *     quantity:
 *      type: integer
 *    example:
 *     id: 1
 *     startDate: 2022-07-13 15:00:00
 *     endDate: 2022-07-14 10:00:00
 *     discountPercent: 0.1
 *     quantity: 10
 */

/**
 * @swagger
 * tags:
 *  name: Voucher
 *  description: About Voucher
 */

/**
 * @swagger
 * paths:
 *  /api/v1/vouchers:
 *   get:
 *    summary: Return the list of all vouchers
 *    security:
 *    - bearerAuth: []
 *    tags: [Voucher]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Voucher'
 *     401:
 *      description: unauthorized
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Please login to access
 *     403:
 *      description: forbidden
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Do not have permission
 *   post:
 *    summary: Add a new voucher
 *    security:
 *    - bearerAuth: []
 *    tags: [Voucher]
 *    requestBody:
 *     description: Voucher object that needs to be added
 *     required: true
 *     content:
 *      application/x-www-form-urlencoded:
 *       schema:
 *        type: object
 *        properties:
 *         startDate:
 *          type: string
 *          format: date
 *          example: 2022-07-13
 *         endDate:
 *          type: string
 *          format: date
 *          example: 2022-07-14
 *         discountPercent:
 *          type: integer
 *          example: 0.1
 *         quantity:
 *           type: integer
 *           example: 10
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Voucher'
 *     401:
 *      description: unauthorized
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Please login to access
 *     403:
 *      description: forbidden
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Do not have permission
 *
 *  /api/v1/vouchers/{voucherId}:
 *   get:
 *    summary: Find voucher by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Voucher]
 *    parameters:
 *     - in: path
 *       name: voucherId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the voucher to get
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Voucher'
 *     401:
 *      description: unauthorized
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Please login to access
 *     403:
 *      description: forbidden
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Do not have permission
 *     404:
 *      description: not found
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: No voucher found with that ID
 *
 *   patch:
 *    summary: Update voucher by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Voucher]
 *    parameters:
 *     - in: path
 *       name: voucherId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the voucher to get
 *    requestBody:
 *     description: Voucher object that needs to be updated
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         startDate:
 *          type: string
 *          format: date
 *          example: 2022-07-13
 *         endDate:
 *          type: string
 *          format: date
 *          example: 2022-07-14
 *         quantity:
 *          type: integer
 *          example: 10
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Voucher'
 *     401:
 *      description: unauthorized
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Please login to access
 *     403:
 *      description: forbidden
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Do not have permission
 *     404:
 *      description: not found
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: No voucher found with that ID
 *
 *   delete:
 *    summary: Delete voucher by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Voucher]
 *    parameters:
 *     - in: path
 *       name: voucherId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the voucher to delete
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: success
 *          data:
 *           type: string
 *           example: null
 *     401:
 *      description: unauthorized
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Please login to access
 *     403:
 *      description: forbidden
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: Do not have permission
 *     404:
 *      description: not found
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: fail
 *          message:
 *           type: string
 *           example: No voucher found with that ID
 */
