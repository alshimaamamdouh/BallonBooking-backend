const mongoose = require('mongoose');

const balloonScheduleSchema = new mongoose.Schema({
  balloonRide: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide', required: true },
  date: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
  seatsAvailable: { type: Number, required: true }
});

module.exports = mongoose.model('BalloonSchedule', balloonScheduleSchema);
