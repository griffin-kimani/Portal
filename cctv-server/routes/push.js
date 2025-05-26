const express = require('express');
const auth = require('../middleware/authMiddleware');
const PushSubscription = require('../models/PushSubscription');
const router = express.Router();

// POST /api/push/subscribe
router.post('/subscribe', auth, async (req, res) => {
  const { endpoint, keys } = req.body;
  try {
    const exists = await PushSubscription.findOne({ endpoint });
    if (!exists) {
      const sub = new PushSubscription({ endpoint, keys, userId: req.user?._id });
      await sub.save();
    }
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

