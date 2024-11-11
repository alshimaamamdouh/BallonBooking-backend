const mongoose = require('mongoose');

const dailyBookingSchema = new mongoose.Schema({
  balloonSchedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule', required: true },
  date: { type: Date, required: true }, // Specific date for the booking (yyyy-mm-dd)
  totalSeats: { type: Number, required: true }, // Total seats based on the linked schedule
  bookedSeats: { type: Number, default: 0 }, // Seats booked for this specific date
  status: { type: String, enum: ['available', 'fully_booked', 'completed'], default: 'available' } // Status of the day's booking
});

// Virtual field to calculate empty seats
dailyBookingSchema.virtual('availableSeats').get(function () {
  return this.totalSeats - this.bookedSeats;
});

// Pre-save hook to set totalSeats based on linked schedule
dailyBookingSchema.pre('save', async function (next) {
  try {
    if (this.isNew) { // Only fetch totalSeats on document creation
      const schedule = await mongoose.model('BalloonSchedule').findById(this.balloonSchedule);
      if (schedule) {
        this.totalSeats = schedule.totalSeats;
      } else {
        throw new Error('Schedule not found');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('DailyBooking', dailyBookingSchema);
