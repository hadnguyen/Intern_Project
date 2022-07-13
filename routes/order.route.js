const express = require('express');
const orderController = require('../controllers/order.controller');
const authController = require('../controllers/auth.controller');
const orderValidation = require('../validations/order.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), orderController.getAllOrders)
  .post(
    validate(orderValidation.orderSchema, 'body'),
    orderController.createOrder
  );

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(
    validate(orderValidation.updatedOrderSchema, 'body'),
    orderController.updateOrder
  );

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *   Order:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *     name:
 *      type: string
 *     address:
 *      type: string
 *     telephone:
 *      type: string
 *     email:
 *      type: string
 *     total:
 *      type: integer
 *     status:
 *      type: string
 *     userId:
 *      type: integer
 *     voucherId:
 *      type: integer
 *    example:
 *     id: 1
 *     name: test
 *     address: VN
 *     telephone: 12345678
 *     email: test@gmail.com
 *     total: 3000
 *     status: new
 *     userId: 1
 *     voucherId: 1
 */

/**
 * @swagger
 * tags:
 *  name: Order
 *  description: About Order
 */

/**
 * @swagger
 * paths:
 *  /api/v1/orders:
 *   get:
 *    summary: Return the list of all orders
 *    security:
 *    - bearerAuth: []
 *    tags: [Order]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Order'
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
 *    summary: Add a new order
 *    security:
 *    - bearerAuth: []
 *    tags: [Order]
 *    requestBody:
 *     description: Order object that needs to be added
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *          example: Test
 *         address:
 *          type: string
 *          example: VN
 *         telephone:
 *          type: string
 *          example: 123
 *         email:
 *          type: string
 *          example: test@gmail.com
 *         items:
 *          type: array
 *          items:
 *           properties:
 *            id:
 *             type: integer
 *            quantity:
 *             type: integer
 *         voucherId:
 *          type: integer
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Order'
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
 *  /api/v1/orders/{orderId}:
 *   get:
 *    summary: Find order by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Order]
 *    parameters:
 *     - in: path
 *       name: orderId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the order to get
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Order'
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
 *           example: No order found with that ID
 *
 *   patch:
 *    summary: Update order by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Order]
 *    parameters:
 *     - in: path
 *       name: orderId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the order to get
 *    requestBody:
 *     description: Order object that needs to be updated
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *          example: test
 *         status:
 *          type: string
 *          example: in progress
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Order'
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
 *           example: No order found with that ID
 *
 */
