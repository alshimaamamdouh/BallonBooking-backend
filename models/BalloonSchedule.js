const mongoose = require('mongoose');

const balloonScheduleSchema = new mongoose.Schema({
  balloonRide: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide', required: true },
  date: { type: Date },
  day: {type: String, required: true},
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
  timeZone: { type: String, required: true },
  totalSeats: { type: Number, required: true }, // Initial total seats for the ride
  bookedSeats: { type: Number, default: 0 } // Track booked seats over time
});

// Virtual field to calculate empty seats
balloonScheduleSchema.virtual('emptySeats').get(function () {
  return this.totalSeats - this.bookedSeats;
});

module.exports = mongoose.model('BalloonSchedule', balloonScheduleSchema);
