const mongoose = require('mongoose');

const balloonScheduleSchema = new mongoose.Schema({
  balloonRide: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide', required: true },
  date: { type: Date, required: true },
  startTime: {
    hours: { type: Number, required: true, min: 0, max: 23 },
    minutes: { type: Number, required: true, min: 0, max: 59 },
    seconds: { type: Number, required: false, min: 0, max: 59 } // Optional field
  },
  endTime: {
    hours: { type: Number, required: true, min: 0, max: 23 },
    minutes: { type: Number, required: true, min: 0, max: 59 },
    seconds: { type: Number, required: false, min: 0, max: 59 } // Optional field
  },
  timeZone: { type: String, required: true }
});


module.exports = mongoose.model('BalloonSchedule', balloonScheduleSchema);
