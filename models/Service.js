const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Service', serviceSchema);
