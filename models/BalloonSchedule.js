const mongoose = require('mongoose');
const BalloonRide = require('./BalloonRide'); // Assuming BalloonRide model is in the same directory

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
  totalSeats: { type: Number }, // Will be set from BalloonRide.seatsAvailable
  bookedSeats: { type: Number, default: 0 } // Track booked seats over time
});

// Virtual field to calculate empty seats
balloonScheduleSchema.virtual('emptySeats').get(function () {
  return this.totalSeats - this.bookedSeats;
});

// Pre-save 
balloonScheduleSchema.pre('save', async function (next) {
  try {
  
      const ride = await BalloonRide.findById(this.balloonRide);
      if (ride) {
        this.totalSeats = ride.seatsAvailable;
      } else {
        throw new Error('BalloonRide not found');
      }
    
    next();
  } catch (error) {
    next(error);
  }
});

balloonScheduleSchema.pre('findOneAndDelete', async function (next) {
  const references = [
    { model: mongoose.model('Cart'), field: 'schedule' }
  ];
  const model_ = await this.model.findOne({'code': this.getFilter().code});
  if(model_){
    const id_ = model_._id;
    const isReferenced = await isDocumentReferenced(id_, references);
    if (isReferenced) {
      return next(new Error('Cannot delete: Balloon schedule is referenced in other collections(Cart).'));
  }
  return next(new Error('Cannot delete: Balloon schedule is not found'));
  }

  next();
});
module.exports = mongoose.model('BalloonSchedule', balloonScheduleSchema);
