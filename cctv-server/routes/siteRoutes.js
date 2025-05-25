const express = require('express');
const Site    = require('../models/Site');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router();


router.get('/', auth, async (req, res) => {
  const sites = await Site.find();
  res.json(sites);
});


router.post('/', auth, async (req, res) => {
  try {
    const site = new Site({ ...req.body, createdBy: req.user.username });
    await site.save();
    res.status(201).json(site);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
