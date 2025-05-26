const express = require('express');
const Alert = require('../models/Alert');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// GET all alerts
router.get('/', auth, async (req, res) => {
  const alerts = await Alert.find().populate('cameraId', 'name location');
  res.json(alerts);
});

// POST a new alert manually
router.post('/', auth, async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;