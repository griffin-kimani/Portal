const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  address:   { type: String },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  createdBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Site', siteSchema);
