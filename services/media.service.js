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

const updateMedia = async (mediaId, mediaBody, file) => {
  const media = await Media.findOne({ where: { id: mediaId } });

  if (!media) {
    throw new AppError('No media found with that ID', 404);
  }
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'VMO_Project/Item',
      use_filename: true,
    });

    mediaBody.url = result.secure_url;

    await Media.update(mediaBody, {
      where: {
        id: mediaId,
      },
    });

    await media.reload();
    return media;
  } catch (error) {
    throw new AppError('Internal server error', 500);
  }
};

module.exports = {
  getAllMedias,
  updateMedia,
};
