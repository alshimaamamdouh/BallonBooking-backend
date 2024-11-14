const mongoose = require('mongoose');
const Promotion = require('./Promotion');
const BalloonSchedule = require('./BalloonSchedule');
const DailyBooking = require('./DailyBooking');
const { findById } = require('./Promotion');
const checkSchedule = require('../functions/checkSchedule');

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
      balloonSchedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule'},
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

//pre
orderSchema.pre('save', async function(next) {

  try {
    // Generate order number if it's a new order
    if (this.isNew) {
      const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
      this.orderNumber = `#${randomFourDigits}`;
    }

 // Loop through orderItems and ensure uniqueness by merging duplicates
 const uniqueItems = [];
 for (const item of this.orderItems) {
   // Check if an item with the same balloonSchedule and bookingDate already exists
   let found = false;

    // Compare item with existing items in uniqueItems
      for (const uniqueItem of uniqueItems) {
        if (
          uniqueItem.balloonSchedule.toString() === item.balloonSchedule.toString() &&
          new Date(uniqueItem.bookingDate).getFullYear() === new Date(item.bookingDate).getFullYear() &&
          new Date(uniqueItem.bookingDate).getMonth() === new Date(item.bookingDate).getMonth() &&
          new Date(uniqueItem.bookingDate).getDate() === new Date(item.bookingDate).getDate()
        ) {
          // If duplicate found, merge adult and child counts
          uniqueItem.adult += item.adult;
          uniqueItem.child += item.child;
          found = true;
          break;
        }
      }

      // If no duplicate found, push the item to uniqueItems
      if (!found) {
        uniqueItems.push(item);
      }
    }
    this.orderItems = uniqueItems;
   
    // Push status change to history if 'status' was modified
    if (this.isModified('status')) {
      this.statusHistory.push({
        status: this.status,
        date: new Date(),
        note: 'Status changed'
      });
    }

    // Calculate total amount considering promotions
    const calculateTotalAmount = async () => {
      const total = this.orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
      const promotion = await Promotion.findOne({ "code": this.promotionCode });

      if (!promotion || promotion.status !== 'Active' || promotion.start > Date.now() || promotion.end < Date.now()) {
        return total;
      }

      const finalDiscount = (total * promotion.discount) / 100;
      return total - finalDiscount;
    };

    const finalAmount = await calculateTotalAmount();
    this.total = finalAmount >= 0 ? finalAmount : 0;
     // add to dailybooking 
    for(const item of this.orderItems) {
      try {
      const dailyBooking = await DailyBooking.findOne({ 'balloonSchedule': item.balloonSchedule ,'bookingDate': item.bookingDate});

        if (dailyBooking) {
          // Update bookedSeats for existing DailyBooking
          dailyBooking.bookedSeats +=  item.child + item.adult;
          await dailyBooking.save();
        } else {
          
          // Create a new DailyBooking entry
          const newDaily = new DailyBooking();
          newDaily.balloonSchedule = item.balloonSchedule,
          newDaily.bookingDate = item.bookingDate,
          newDaily.bookedSeats =  item.child + item.adult;
          await newDaily.save();
          
        }
      } catch (error) {
        if (error.isFull) {
          // Stop further processing by passing this error to next()
          return next(error);
        }
        // Re-throw if it's a different error
        throw error;
      }
      }
   

    next();
  } catch (error) {
    console.error("Error in order pre-save middleware:", error);
    next(error);
  }
});

// //post
// orderSchema.post('save', async function(doc, next) {
//   try {
//     const order = doc;

//     for(const item of order.orderItems) {
    
//       const dailyBooking = await DailyBooking.findOne({ 'balloonSchedule': item.balloonSchedule ,'bookingDate': item.bookingDate});

//         if (dailyBooking) {
//           // Update bookedSeats for existing DailyBooking
//           dailyBooking.bookedSeats +=  item.child + item.adult;
//           await dailyBooking.save();
//         } else {
          
//           // Create a new DailyBooking entry
//           const newDaily = new DailyBooking();
//           newDaily.balloonSchedule = item.balloonSchedule,
//           newDaily.bookingDate = item.bookingDate,
//           newDaily.bookedSeats =  item.child + item.adult;
//           await newDaily.save();
          
//         }
//       }
//     next();
//   } catch (error) {
//     console.error("Error in order post-save middleware:", error);
//     next(error);
//   }
// });


module.exports = mongoose.model('Order', orderSchema);
