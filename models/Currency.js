const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  code: { type: String, required: true , unique: true },  // Currency code 
  name: { type: String, required: true },  
  symbol: { type: String, required: true }, // Currency symbol (eg, $, €)
});

module.exports = mongoose.model('Currency', currencySchema);
