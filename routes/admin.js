const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

/* =======================
   Cloudinary Config
======================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* =======================
   Verify Admin Middleware
======================= */
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.admin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/* =======================
   Admin Login
======================= */
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password required'
    });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: 'Invalid password'
    });
  }

  const token = jwt.sign(
    {
      admin: true,
      role: 'ADMIN'
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    message: 'Login successful'
  });
});

/* =======================
   Admin Verify (IMPORTANT)
======================= */
router.get('/verify', verifyAdmin, (req, res) => {
  res.json({
    success: true,
    admin: true
  });
});

/* =======================
   Upload Image
======================= */
router.post('/upload-image', verifyAdmin, async (req, res) => {
  try {
    const { image, folder } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: `mpl/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
});

/* =======================
   Delete Image
======================= */
router.delete('/delete-image', verifyAdmin, async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID required'
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Delete failed'
    });
  }
});

module.exports = router;
