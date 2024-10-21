const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
      ride: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide' },
      schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule' },
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
