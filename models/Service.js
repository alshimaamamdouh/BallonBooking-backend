const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  available: { type: Boolean, default: true },
  imageUrl: {type: String },
  imageUrls: [ { type: String, }],
  public_id: {type: String },
  public_ids: [{ type: String }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }  
});

serviceSchema.index({ company: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Service', serviceSchema);
