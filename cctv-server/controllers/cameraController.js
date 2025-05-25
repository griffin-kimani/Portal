const Camera = require('../models/Camera');

exports.getCamerasBySite = async (req, res) => {
  const cameras = await Camera.find({ siteId: req.params.siteId });
  res.json(cameras);
};
