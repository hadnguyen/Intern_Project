const express = require('express');
const categoryController = require('../controllers/category.controller');
const authController = require('../controllers/auth.controller');
const categoryValidation = require('../validations/category.validation');
const validate = require('../middlewares/validate');
const itemRoute = require('./item.route');
const upload = require('../utils/multer');
const router = express.Router();

router.use('/:categoryId/items', itemRoute);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    upload.array('banner'),
    validate(categoryValidation.categorySchema, 'body'),
    categoryController.createCategory
  );

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(upload.array('banner'), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *   Category:
 *    type: object
 *    properties:
 *     _id:
 *      type: objectId
 *     name:
 *      type: string
 *     priority:
 *      type: integer
 *     banner:
 *      type: array
 *      items:
 *       type: string
 *     status:
 *      type: string
 *    example:
 *     id: 1
 *     name: Phone
 *     priority: 1
 *     banner: [image1.jpeg, image2.jpeg]
 *     status: active
 */

/**
 * @swagger
 * tags:
 *  name: Category
 *  description: About Category
 */

/**
 * @swagger
 * paths:
 *  /api/v1/categories:
 *   get:
 *    summary: Return the list of all categories
 *    security:
 *    - bearerAuth: []
 *    tags: [Category]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Category'
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
 *   post:
 *    summary: Add a new category
 *    security:
 *    - bearerAuth: []
 *    tags: [Category]
 *    requestBody:
 *     description: Category object that needs to be added
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Category'
 *       example:
 *        name: Phone
 *        priority: 1
 *        banner: [image1.jpeg, image2.jpeg]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Category'
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
 *  /api/v1/categories/{categoryId}:
 *   get:
 *    summary: Find category by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Category]
 *    parameters:
 *     - in: path
 *       name: categoryId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the category to get
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Category'
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
 *
 *   patch:
 *    summary: Update category by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Category]
 *    parameters:
 *     - in: path
 *       name: categoryId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the category to get
 *    requestBody:
 *     description: Category object that needs to be updated
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Category'
 *       example:
 *        name: Phone
 *        priority: 1
 *        banner: [image1.jpeg, image2.jpeg]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Category'
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
 *   delete:
 *    summary: Delete category by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Category]
 *    parameters:
 *     - in: path
 *       name: categoryId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the category to delete
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
 */
