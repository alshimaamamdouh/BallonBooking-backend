const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  code: { type: String, required: true , unique: true },
  name: { type: String, required: true },
  logo: { type: String },  // URL 
  location: [
    {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    coordinates: { type: [Number] }
    }
  ],
  description: { type: String }
});



module.exports = mongoose.model('Company', companySchema);
