const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  available: { type: Boolean, default: true },
  imageUrl: {type: String },
  imageUrls: [ { type: String, }],
  public_id: {type: String },
  public_ids: [{ type: String }],
});


module.exports = mongoose.model('Service', serviceSchema);
