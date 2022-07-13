const express = require('express');
const authController = require('../controllers/auth.controller');
const mediaController = require('../controllers/media.controller');
const upload = require('../utils/multer');

const router = express.Router();

// router.use(authController.protect);
// router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(mediaController.getAllMedias)
  .post(upload.single('url'), mediaController.createMedia);

router.route('/:id').patch(upload.single('media'), mediaController.updateMedia);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *   Media:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *     name:
 *      type: string
 *     url:
 *      type: string
 *     type:
 *      type: string
 *     itemId:
 *      type: integer
 *    example:
 *     id: 1
 *     name: test
 *     url: test
 *     type: avatar
 *     itemId: 1
 */

/**
 * @swagger
 * tags:
 *  name: Media
 *  description: About Media
 */

/**
 * @swagger
 * paths:
 *  /api/v1/medias:
 *   get:
 *    summary: Return the list of all medias
 *    security:
 *    - bearerAuth: []
 *    tags: [Media]
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Media'
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
 *    summary: Add a new media
 *    security:
 *    - bearerAuth: []
 *    tags: [Media]
 *    requestBody:
 *     description: Media object that needs to be added
 *     required: true
 *     content:
 *      multipart/form-data:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *          example: test
 *         url:
 *          type: string
 *          format: binary
 *         type:
 *          type: string
 *          example: avatar
 *         itemId:
 *           type: integer
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Media'
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
 *  /api/v1/medias/{mediaId}:
 *   patch:
 *    summary: Update media by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [Media]
 *    parameters:
 *     - in: path
 *       name: mediaId
 *       schema:
 *        type: integer
 *       required: true
 *       description: Numeric ID of the media to get
 *    requestBody:
 *     description: Media object that needs to be updated
 *     required: true
 *     content:
 *      multipart/form-data:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *         url:
 *          type: string
 *          format: binary
 *         type:
 *          type: string
 *         itemId:
 *          type: integer
 *    responses:
 *     200:
 *      description: success
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/Media'
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
 *           example: No media found with that ID
 */
