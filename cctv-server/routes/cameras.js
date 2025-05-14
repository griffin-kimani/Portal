const express2 = require('express');
const { body, validationResult, param } = require('express-validator');
const authMiddleware2 = require('../middleware/authMiddleware');
const Camera = require('../models/Camera');

const router2 = express2.Router();

router2.get('/', authMiddleware2, async (req, res) => {
  try {
    const cameras = await Camera.find({ addedBy: req.user.username });
    res.json({ cameras });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router2.post(
  '/',
  authMiddleware2,
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('location', 'Location is required').trim().notEmpty(),
    body('rtspUrl', 'Valid RTSP URL is required').matches(/^rtsp:\/\/.+/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, location, rtspUrl } = req.body;
      const camera = new Camera({ name, location, rtspUrl, addedBy: req.user.username });
      await camera.save();
      res.status(201).json({ message: `Camera '${name}' added at '${location}'`, camera });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router2.delete(
  '/:id',
  authMiddleware2,
  [param('id', 'Invalid camera ID').isMongoId()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;
      const deleted = await Camera.findOneAndDelete({ _id: id, addedBy: req.user.username });
      if (!deleted) {
        return res.status(404).json({ message: 'Camera not found or unauthorized' });
      }
      res.json({ message: `Camera with ID '${id}' removed` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router2;
