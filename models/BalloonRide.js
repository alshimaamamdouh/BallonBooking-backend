const mongoose = require('mongoose');

const balloonRideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  seatsAvailable: { type: Number, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  discount: { type: Number, default: 0 },   
  currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: true } // Ref to Currency model
});


module.exports = mongoose.model('BalloonRide', balloonRideSchema);
