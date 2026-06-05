const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Order = require('../models/Order');

// POST /api/upload/:orderId
router.post('/:orderId', upload.array('documents', 5), async (req, res) => {
  try {
    const files = req.files.map(f => ({
      url: f.path,
      publicId: f.filename
    }));

    await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $push: { documents: { $each: files } } }
    );

    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

module.exports = router;