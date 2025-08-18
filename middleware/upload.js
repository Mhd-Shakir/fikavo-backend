// Backend/middleware/upload.js
const multer = require('multer');

const storage = multer.memoryStorage();

const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only jpeg, jpg, png, webp images allowed'));
  },
});

module.exports = upload;