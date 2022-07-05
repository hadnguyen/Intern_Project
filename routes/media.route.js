const express = require('express');
const authController = require('../controllers/auth.controller');
const mediaController = require('../controllers/media.controller');
const upload = require('../utils/multer');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(mediaController.getAllMedias)
  .post(upload.single('media'), mediaController.createMedia);

module.exports = router;
