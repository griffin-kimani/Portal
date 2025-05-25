const express = require('express');
const Footage = require('../models/Footage');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router();

// List all footage for a camera (with optional date range)
router.get('/', auth, async (req, res) => {
  const { cameraId, from, to, page = 1, limit = 20 } = req.query;
  const filter = { cameraId };
  if (from) filter.startTime = { $gte: new Date(from) };
  if (to ) filter.endTime   = { ...filter.endTime, $lte: new Date(to) };

  const items = await Footage.find(filter)
    .sort({ startTime: -1 })
    .skip((page-1)*limit)
    .limit(limit)
    .exec();

  res.json(items);
});

// Stream/download a specific clip
router.get('/:id/stream', auth, async (req, res) => {
  const clip = await Footage.findById(req.params.id);
  if (!clip) return res.status(404).json({ message: 'Not found' });
  res.sendFile(clip.path);
});

module.exports = router;
