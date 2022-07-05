const { Media } = require('../models/index');
const AppError = require('../utils/appError');
const ApiFeatures = require('../common/apiFeatures');
const cloudinary = require('../utils/cloudinary');

const getAllMedias = async (queryString) => {
  try {
    const medias = await ApiFeatures(Media, queryString);
    return medias;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

const createMedia = async (itemId, mediaBody, file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'VMO_Project/Item',
      use_filename: true,
    });

    mediaBody.url = result.secure_url;
    mediaBody.itemId = itemId;

    const media = await Media.create(mediaBody);

    return media;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

module.exports = {
  getAllMedias,
  createMedia,
};
