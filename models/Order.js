const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide' }, 
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule' }, 
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
