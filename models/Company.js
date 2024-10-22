const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },  // URL 
  description: { type: String }
});



module.exports = mongoose.model('Company', companySchema);
