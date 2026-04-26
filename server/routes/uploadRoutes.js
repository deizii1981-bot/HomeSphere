import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Setup Multer Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

// Upload Middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload multiple images
// @route   POST /api/uploads
// @access  Private/Host (assuming protected where used)
router.post('/', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  // Map files to their urls
  const fileUrls = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);

  res.status(200).json({
    success: true,
    data: fileUrls,
    message: 'Images uploaded successfully',
  });
});

export default router;
