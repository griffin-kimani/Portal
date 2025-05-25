const Site = require('../models/Site');

exports.getAllSites = async (req, res) => {
  const sites = await Site.find();
  res.json(sites);
};
