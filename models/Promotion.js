const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true},
  description: { type: String },
  discount: { type: Number, default: 0 },
  start: { type: Date, requird: true },
  end: { type: Date, requird: true },
  status: {type: String, default:'Active'},
});


module.exports = mongoose.model('Promotion', promotionSchema);
