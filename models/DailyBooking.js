const mongoose = require('mongoose');

const dailyBookingSchema = new mongoose.Schema({
  balloonSchedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule', required: true },
  bookingDate: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
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
      const ride = await BalloonRide.findById(this.balloonSchedule.BalloonRide);
      if (ride) {
        this.seatsAvailable = ride.seatsAvailable;
        this.totalSeats = ride.seatsAvailable;
      } else {
        throw new Error('Schedule not found');
      }
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
