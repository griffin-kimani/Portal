const express = require('express');
const { body, validationResult, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Camera = require('../models/Camera');

const router = express.Router();

// Get all cameras for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cameras = await Camera.find({ addedBy: req.user.username });
    res.json({ cameras });
  } catch (err) {
    console.error('Fetch cameras error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new camera
router.post(
  '/',
  authMiddleware,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('rtspUrl').matches(/^rtsp:\/\/.+/).withMessage('Valid RTSP URL is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, location, rtspUrl } = req.body;
      const camera = new Camera({
        name,
        location,
        rtspUrl,
        addedBy: req.user.username,
      });
      await camera.save();

      res.status(201).json({
        message: `Camera '${name}' added at '${location}'`,
        camera,
      });
    } catch (err) {
      console.error('Add camera error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete a camera by ID
router.delete(
  '/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Invalid camera ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const deleted = await Camera.findOneAndDelete({
        _id: id,
        addedBy: req.user.username,
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Camera not found or unauthorized' });
      }

      res.json({ message: `Camera with ID '${id}' removed` });
    } catch (err) {
      console.error('Delete camera error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
