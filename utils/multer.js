const multer = require('multer');
const path = require('path');
const AppError = require('./appError');

module.exports = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      console.log(req.baseUrl);
      let name;
      if (req.baseUrl.split('/')[3] === 'users')
        name = `user-${req.user.id}-${Date.now()}.${ext}`;
      if (req.baseUrl.split('/')[3] === 'categories')
        name = `category-${Date.now()}.${ext}`;
      if (
        req.baseUrl.split('/')[3] === 'items' ||
        req.baseUrl.split('/')[3] === 'medias'
      )
        name = `item-${Date.now()}.${ext}`;

      cb(null, name);
    },
  }),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new AppError('File type is not supported', 400), false);
    }
    cb(null, true);
  },
});
