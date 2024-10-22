const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide' }, 
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule' }, 
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending', required: true },
  orderDate: { type: Date, default: Date.now }
});

// Pre-saving to generate orderNumber starts with #
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    const randomFourDigits = Math.floor(1000 + Math.random() * 9000); // number between 1000 and 9999
    this.orderNumber = `#${randomFourDigits}`; // adding #
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
