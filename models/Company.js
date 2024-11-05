const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  code: { type: String, required: true , unique: true },
  name: { type: String, required: true },
  logo: { type: String }, 
  public_id: { type: String }, 
  location: [
    {
    street: { type: String },
    city: { type: String },
    country: { type: String },
    zip: { type: String },
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
    }
  ],
  description: { type: String }
});



module.exports = mongoose.model('Company', companySchema);
