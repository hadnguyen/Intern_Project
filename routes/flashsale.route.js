const express = require('express');
const flashsaleController = require('../controllers/flashsale.controller');
const authController = require('../controllers/auth.controller');
const flashsaleValidation = require('../validations/flashsale.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', flashsaleController.getAllFlashSales);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post(
  '/',
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

/**
 * @swagger
 * components:
 *  schemas:
 *   FlashSale:
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
 *    example:
 *     id: 1
 *     startDate: 2022-07-13 15:00:00
 *     endDate: 2022-07-14 10:00:00
 */

/**
 * @swagger
 * tags:
 *  name: FlashSale
 *  description: About FlashSale
 */

/**
 * @swagger
 * paths:
 *  /api/v1/flashsales:
 *   get:
 *    summary: Return the list of all flashsales
 *    security:
 *    - bearerAuth: []
 *    tags: [FlashSale]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/FlashSale'
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
 *    summary: Add a new flashsale
 *    security:
 *    - bearerAuth: []
 *    tags: [FlashSale]
 *    requestBody:
 *     description: FlashSale object that needs to be added
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         flashsales:
 *          type: array
 *          items:
 *           properties:
 *            discountPercent:
 *             type: integer
 *             example: 0.1
 *            quantity:
 *             type: integer
 *             example: 10
 *            itemId:
 *             type: integer
 *             example: 1
 *         startDate:
 *          type: string
 *          format: date
 *          example: 2022-07-13
 *         endDate:
 *          type: string
 *          format: date
 *          example: 2022-07-14
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/FlashSale'
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
 *  /api/v1/flashsales/{flashsaleId}:
 *   get:
 *    summary: Find flashsale by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [FlashSale]
 *    parameters:
 *     - in: path
 *       name: flashsaleId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the flashsale to get
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/FlashSale'
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
 *           example: No flashsale found with that ID
 *
 *   patch:
 *    summary: Update flashsale by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [FlashSale]
 *    parameters:
 *     - in: path
 *       name: flashsaleId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the flashsale to get
 *    requestBody:
 *     description: FlashSale object that needs to be updated
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
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/FlashSale'
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
 *           example: No flashsale found with that ID
 *
 *   delete:
 *    summary: Delete flashsale by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [FlashSale]
 *    parameters:
 *     - in: path
 *       name: flashsaleId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the flashsale to delete
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
 *           example: No flashsale found with that ID
 */
