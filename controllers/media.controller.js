const catchAsync = require('../utils/catchAsync');
const mediaService = require('../services/media.service');

const getAllMedias = catchAsync(async (req, res) => {
  const medias = await mediaService.getAllMedias(req.query);

  res.status(200).json({
    status: 'success',
    results: medias.rows.length,
    totalMedias: medias.count,
    totalPages: medias.totalPages,
    currentPage: medias.pageValue,
    pageSize: medias.limitValue,
    data: medias.rows,
  });
});

const createMedia = catchAsync(async (req, res) => {
  const media = await mediaService.createMedia(
    req.params.itemId,
    req.body,
    req.file
  );

  res.status(201).json({
    status: 'success',
    data: {
      media,
    },
  });
});

module.exports = {
  getAllMedias,
  createMedia,
};
