const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + EXTENSIONS[file.mimetype]),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (EXTENSIONS[file.mimetype]) return cb(null, true);
    const err = new Error('Use a JPG, PNG, GIF, or WebP image');
    err.status = 400;
    cb(err);
  },
});

module.exports = upload;
