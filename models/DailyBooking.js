const mongoose = require('mongoose');
const BalloonSchedule = require('../models/BalloonSchedule');
const BalloonRide = require('../models/BalloonRide');

const dailyBookingSchema = new mongoose.Schema({
  balloonSchedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule', required: true },
  bookingDate: { type: Date, required: true },
  totalSeats: { type: Number},
  bookedSeats: { type: Number, default: 0 },
  seatsAvailable: { type: Number },
  status: { type: Boolean, default: true }
});
// Cart table:
  // check in this table from cart id the date is inserted check the status if ture is available 
  // Also check if this date not in this table considered available
// Order table:
  // we will insert in this table and check the available seats untill its not available and status become false
   
// Pre-save hook to set totalSeats based on linked schedule
dailyBookingSchema.pre('save', async function (next) {
  try {
    if (this.isNew) { // Only fetch totalSeats on document creation
      const balloonSchedule = await BalloonSchedule.findById(this.balloonSchedule);
      const ride = await BalloonRide.findById(balloonSchedule.balloonRide);
      if (ride) {
        this.totalSeats = ride.seatsAvailable;
        this.seatsAvailable = this.totalSeats - this.bookedSeats;
      } else {
        throw new Error('Schedule not found');
      }
    }else{
      this.seatsAvailable = this.totalSeats - this.bookedSeats;
    }

    if (this.totalSeats  === this.bookedSeats)
    {
      this.status = false; //not available
    }else{
      this.status = true; //available
    }
    
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('DailyBooking', dailyBookingSchema);
