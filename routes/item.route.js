const express = require('express');
const itemController = require('../controllers/item.controller');
const authController = require('../controllers/auth.controller');
const mediaRoute = require('../routes/media.route');
const itemValidation = require('../validations/item.validation');
const validate = require('../middlewares/validate');
const upload = require('../utils/multer');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(itemController.getAllItems)
  .post(
    upload.single('media'),
    validate(itemValidation.itemSchema, 'body'),
    itemController.createItem
  );

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *   Item:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *     name:
 *      type: string
 *     barcode:
 *      type: string
 *     costPrice:
 *      type: bigint
 *     sellingPrice:
 *      type: bigint
 *     weight:
 *      type: float
 *     inventoryQuantity:
 *      type: integer
 *     soldQuantity:
 *      type: integer
 *     description:
 *      type: string
 *     categoryId:
 *      type: integer
 *    example:
 *     id: 1
 *     name: Samsung
 *     barcode: 1111
 *     costPrice: 1000
 *     sellingPrice: 2000
 *     weight: 3
 *     inventoryQuantity: 10
 *     soldQuantity: 0
 *     description: Good
 *     categoryId: 1
 *
 */

/**
 * @swagger
 * tags:
 *  name: Item
 *  description: About Item
 */

/**
 * @swagger
 * paths:
 *  /api/v1/items:
 *   get:
 *    summary: Return the list of all items
 *    security:
 *    - bearerAuth: []
 *    tags: [Item]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Item'
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
 *    summary: Add a new item
 *    security:
 *    - bearerAuth: []
 *    tags: [Item]
 *    requestBody:
 *     description: Itemm object that needs to be added
 *     required: true
 *     content:
 *      multipart/form-data:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *          example: Samsung
 *         barcode:
 *          type: string
 *          example: 1111
 *         costPrice:
 *          type: bigint
 *          example: 1000
 *         sellingPrice:
 *          type: bigint
 *          example: 2000
 *         inventoryQuantity:
 *          type: integer
 *          example: 10
 *         categoryId:
 *          type: integer
 *          example: 1
 *         mediaName:
 *          type: string
 *          example: test
 *         media:
 *          type: string
 *          format: binary
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Item'
 *     400:
 *      description: bad request
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
 *           example: Invalid input value
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
 *  /api/v1/items/{itemId}:
 *   get:
 *    summary: Find item by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: itemId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the item to get
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Item'
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
 *           example: No item found with that ID
 *
 *   patch:
 *    summary: Update item by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: itemId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the item to get
 *    requestBody:
 *     description: Item object that needs to be updated
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *         barcode:
 *          type: string
 *         costPrice:
 *          type: integer
 *         sellingPrice:
 *          type: integer
 *         inventoryQuantity:
 *          type: integer
 *         soldQuantity:
 *          type: integer
 *         categoryId:
 *          type: integer
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Item'
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
 *           example: No item found with that ID
 *
 *   delete:
 *    summary: Delete item by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: itemId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the item to delete
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
 *           example: No item found with that ID
 *
 *  /api/v1/categories/{categoryId}/items:
 *   get:
 *    summary: Return the list of all items by Category
 *    security:
 *    - bearerAuth: []
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: categoryId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the category to get items
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Item'
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
 *           example: No item found with that ID
 */
