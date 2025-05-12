const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Camera = require('../models/Camera');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const cameras = await Camera.find({ addedBy: req.user.username });
  res.json({ cameras });
}); 

router.post('/add', authMiddleware, async (req, res) => {
  const { name, location, rtspUrl } = req.body;
  const camera = new Camera({ name, location, rtspUrl, addedBy: req.user.username });
  await camera.save();
  res.status(201).json({ message: `Camera ${name} added at ${location}` });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await Camera.findByIdAndDelete(id);
  res.json({ message: `Camera with ID ${id} removed` });
});

module.exports = router;