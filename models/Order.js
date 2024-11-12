const mongoose = require('mongoose');
const Promotion = require('./Promotion');
const BalloonSchedule = require('./BalloonSchedule');
const DailyBooking = require('./DailyBooking');
const { findById } = require('./Promotion');

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true
  }, 
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderItems: [
    {
      balloonSchedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule' ,unique: true },
      bookingDate:{ type: Date, required: true },
      adult: { type: Number, required: true, min: 0},
      child: { type: Number, required: true, min: 0 },
      totalPrice: { type: Number, default: 0 }, // Total price for the item
      currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' }, // Reference to the Currency model
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending', required: true },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['Credit Card', 'PayPal', 'Bank Transfer'], required: true },
  promotionCode: { type: String},
  transactionId: { type: String },
  statusHistory: [
    {
      status: { type: String },
      date: { type: Date, default: Date.now },
      note: { type: String }
    }
  ]
});

// Middleware to set totalAmount
orderSchema.pre('save', async function(next) {
  const order = this;

  try {
    if (this.isNew) {
      const randomFourDigits = Math.floor(1000 + Math.random() * 9000); // number between 1000 and 9999
      this.orderNumber = `#${randomFourDigits}`;
      for (const item of this.orderItems){
          const dailyBooking = await DailyBooking.findOne({'bookingDate':item.bookingDate})
          // if(dailyBooking)
          if(dailyBooking)
          {
            bookedSeats = Number(dailyBooking.get('bookedSeats'));
            // dailyBooking.set('bookedSeats',bookedSeats + Number(item.adult) + Number(item.child));
            // const updateDailyBooking = new findByIdAndUpdate(dailyBooking.id,dailyBooking, { new: true });
            const updateDailyBooking = new DailyBooking.findById(dailyBooking.id);
            updateDailyBooking.bookedSeats = bookedSeats + Number(item.adult) + Number(item.child)
            await updateDailyBooking.save();
          }else{
            const newDailyBooking = new DailyBooking();
            // newDailyBooking.set('balloonSchedule',item.balloonSchedule);
            // newDailyBooking.set('bookingDate',item.bookingDate);
            // newDailyBooking.set('bookedSeats', Number(item.adult) + Number(item.child));
            newDailyBooking.balloonSchedule = item.balloonSchedule;
            newDailyBooking.bookingDate = item.bookingDate;
            newDailyBooking.bookedSeats = Number(item.adult) + Number(item.child)
            
            await newDailyBooking.save();
          }
      }
    }
   if (this.isModified('status')) {
    // Only add to history if status was modified
    this.statusHistory.push({
      status: this.status,
      date: new Date(), // Automatically set the current date
      note: 'Status changed' // Optional: customize notes based on specific status changes
    });
  }

    const promotion = await Promotion.findOne({"code" : order.promotionCode })
    if (!promotion){
        // Calculate total amount
        const total = this.orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
        const finalAmount = total;
        order.total = finalAmount >= 0 ? finalAmount : 0; // Ensure totalAmount is not negative

    }else{
      // Calculate total amount
      const total = this.orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
      let finalAmount = 0; 
      if(promotion.status === 'Active' && promotion.start <= Date.now() && promotion.end >= Date.now()){ // start and end date check
        const finalDiscount = (total * promotion.discount) /100 
        finalAmount = total- finalDiscount;
      }else{
        finalAmount = total;
      }
      order.total = finalAmount >= 0 ? finalAmount : 0; // Ensure totalAmount is not negative
  }
    next();
  } catch (error) {
    next(error);
  }
});
orderSchema.post('save', async function (order) {
  // try {
  //   const schedule = await BalloonSchedule.findById(order.balloonSchedule);
  //   if (schedule) {
  //     schedule.bookedSeats += order.seatsRequested;
  //     await schedule.save();
  //   }
  // } catch (error) {
  //   console.error('Error updating booked seats:', error);
  // }
});

module.exports = mongoose.model('Order', orderSchema);
