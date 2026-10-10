const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { badRequest } = require('../lib/errors');

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'));
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const randomHex = crypto.randomBytes(12).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    cb(null, `${file.fieldname}-${randomHex}${ext}`);
  },
});

const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(badRequest('INVALID_FILE_TYPE', 'Only JPEG, PNG, and PDF files are allowed'));
    }
  },
});

const uploadReceipt = upload.single('receipt');
const uploadProof = upload.single('proof');

module.exports = {
  upload,
  uploadReceipt,
  uploadProof,
  uploadDir,
};
