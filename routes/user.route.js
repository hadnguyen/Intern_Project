const express = require('express');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const authValidation = require('../validations/auth.validation');
const validate = require('../middlewares/validate');
const router = express.Router();

router.post(
  '/signup',
  validate(authValidation.signupSchema, 'body'),
  authController.signup
);
router.post(
  '/login',
  validate(authValidation.loginSchema, 'body'),
  authController.login
);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/verification/:token', authController.verifyEmail);

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *     type: object
 *     require:
 *      - name
 *      - email
 *      - password
 *     properties:
 *       _id:
 *         type: objectId
 *       name:
 *         type: string
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *         format: password
 *       role:
 *         type: string
 *       address:
 *         type: string
 *       telephone:
 *         type: string
 *       photo:
 *         type: string
 *       status:
 *         type: string
 *       resetPasswordToken:
 *         type: string
 *       resetPasswordExpire:
 *         type: date
 *       isVerify:
 *         type: boolean
 *     example:
 *      id: 1
 *      name: Test
 *      email: test@mailsac.com
 *      password: 12345678
 *      role: user
 *      address: HN
 *      telephone: 1111111
 *      photo: test.jpeg
 *      status: active
 *      resetPasswordToken: null
 *      resetPasswordExpire: null
 *      isVeriy: false
 *
 *  securitySchemes:
 *    bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: About User
 */

/**
 * @swagger
 * paths:
 *  /api/v1/users/signup:
 *   post:
 *    summary: Create user
 *    tags: [User]
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/User'
 *    responses:
 *     201:
 *      description: success
 *
 *
 *  /api/v1/users/login:
 *   post:
 *    summary: Log in to the system
 *    tags: [User]
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          example: test@mailsac.com
 *         password:
 *          type: string
 *          example: 123
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/User'
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
 *           example: Incorrect email or password
 *
 *  /api/v1/users:
 *   get:
 *    summary: Return the list of all users
 *    security:
 *    - bearerAuth: []
 *    tags: [User]
 *    description: Use to request all users
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/User'
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
 *  /api/v1/users/{userId}:
 *   get:
 *    summary: Find user by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [User]
 *    parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the user to get
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/User'
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
 *    summary: Update user by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [User]
 *    parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the user to get
 *    requestBody:
 *     description: User object that needs to be updated
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *       example:
 *        name: test
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/User'
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
 *    summary: Delete user by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [User]
 *    parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the user to delete
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
