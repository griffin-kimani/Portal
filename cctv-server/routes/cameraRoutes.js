const express = require('express');
const Camera  = require('../models/Camera');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router();


router.get('/', auth, async (req, res) => {
  const cams = await Camera.find()
    .populate('siteId', 'name address')
    .exec();
  res.json(cams);
});


router.get('/:id', auth, async (req, res) => {
  const cam = await Camera.findById(req.params.id)
    .populate('siteId', 'name address');
  res.json(cam);
});


router.post('/', auth, async (req, res) => {
  try {
    const cam = new Camera({
      ...req.body,
      addedBy: req.user.username
    });
    await cam.save();
    res.status(201).json(cam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  const cam = await Camera.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(cam);
});


router.delete('/:id', auth, async (req, res) => {
  await Camera.findByIdAndDelete(req.params.id);
  res.json({ message: 'Camera deleted' });
});

module.exports = router;
