const mongoose = require('mongoose');

const balloonRideSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  location: { 
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
   },
  description: { type: String },
  seatsAvailable: { type: Number, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  discount: { type: Number, default: 0 },   
  currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: true }, // Ref to Currency model
  isAvailable: { type: Boolean, default: true },
  adultPrice: { type: Number, required: true, min: 0 },
  childPrice: { type: Number, required: true, min: 0 },
  imageUrl: {type: String },
  imageUrls: [ { type: String, }],
  public_id: {type: String },
  public_ids: [{ type: String }]
});

balloonRideSchema.index({ location: '2dsphere' }); 

module.exports = mongoose.model('BalloonRide', balloonRideSchema);
