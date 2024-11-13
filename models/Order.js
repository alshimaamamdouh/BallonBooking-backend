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
  const order = this;

  try {
    // Generate order number if it's a new order
    if (this.isNew) {
      const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
      this.orderNumber = `#${randomFourDigits}`;
    }

    // Track seat bookings per schedule
    const scheduleIds = {};
    for (const item of order.orderItems) {
      scheduleIds[item.balloonSchedule.toString() +'###'+ item.bookingDate.toString()] ={'child': (scheduleIds[item.balloonSchedule.toString() +'###'+ item.bookingDate.toString()].child || 0) 
                                             + Number(item.child), 'adult': (scheduleIds[item.balloonSchedule.toString() +'###'+ item.bookingDate.toString()].adult || 0) 
                                             + Number(item.adult)};
    }

    // Set for unique schedules to avoid redundant checks
    const checkSchedule = new Set();
    for (const item of order.orderItems) {
      const scheduleKey = item.balloonSchedule.toString() +'###'+ item.bookingDate.toString();
      if (!checkSchedule.has(scheduleKey) && scheduleKey in scheduleIds) {
        checkSchedule.add(scheduleKey);
        item.child = scheduleIds[schedulekey].child;
        item.adult = scheduleIds[schedulekey].adult;
      }
    }

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

    next();
  } catch (error) {
    console.error("Error in order pre-save middleware:", error);
    next(error);
  }
});

//post
orderSchema.post('save', async function(doc, next) {
  try {
    const order = doc;

    // Track seat bookings per schedule
    const scheduleIds = {};
    for (const item of order.orderItems) {
      scheduleIds[item.balloonSchedule.toString() +'###'+ item.bookingDate.toString()] = (scheduleIds[item.balloonSchedule.toString() +'###'+ item.bookingDate.toString()] || 0) 
                                            + Number(item.adult) + Number(item.child);
    }

    // Set for unique schedules to avoid redundant checks
    const checkSchedule = new Set();
    for (const item of order.orderItems) {
      const scheduleKey = item.balloonSchedule.toString() +'###'+ item.bookingDate.toString();
      if (!checkSchedule.has(scheduleKey) && scheduleKey in scheduleIds) {
        checkSchedule.add(scheduleKey);

        const dailyBooking = await DailyBooking.findOne({ 'balloonSchedule': item.balloonSchedule ,'bookingDate': item.bookingDate});

        if (dailyBooking) {
          // Update bookedSeats for existing DailyBooking
          dailyBooking.bookedSeats += scheduleIds[scheduleKey];
          await dailyBooking.save();
        } else {
          
          // Create a new DailyBooking entry
          const newDaily = new DailyBooking();
          newDaily.balloonSchedule = item.balloonSchedule,
          newDaily.bookingDate = item.bookingDate,
          newDaily.bookedSeats = scheduleIds[scheduleKey]

          await newDaily.save();
          
        }
      }
    }

    next();
  } catch (error) {
    console.error("Error in order post-save middleware:", error);
    next(error);
  }
});



// orderSchema.pre('save', async function(next) {
//   const order = this;

//   try {
//     if (this.isNew) {
//       const randomFourDigits = Math.floor(1000 + Math.random() * 9000); // number between 1000 and 9999
//       this.orderNumber = `#${randomFourDigits}`;
//       let scheduleIds = {};
//       for (const item of this.orderItems){
//         if(!(item.balloonSchedule in scheduleIds))
//           scheduleIds[item.balloonSchedule] = Number(item.adult) + Number(item.child);
//         else
//           scheduleIds[item.balloonSchedule] += Number(item.adult) + Number(item.child);
//       }
//       let checkSchedule = [];
//       for (const item of this.orderItems){
//           if (!checkSchedule.includes(item.balloonSchedule.toString()) && (item.balloonSchedule in scheduleIds)){
//             checkSchedule.push(item.balloonSchedule.toString());
//             const dailyBooking = await DailyBooking.findOne({'balloonSchedule':item.balloonSchedule});
//             if(dailyBooking) 
//             {
//               bookedSeats = Number(dailyBooking.get('bookedSeats'));
//               const updateDailyBooking =  await DailyBooking.findById(dailyBooking.id);
//               updateDailyBooking.bookedSeats = bookedSeats + scheduleIds[item.balloonSchedule];
//               updateDailyBooking.save();
//             }else{
//               const newDailyBooking = new DailyBooking();
//               newDailyBooking.balloonSchedule = item.balloonSchedule;
//               newDailyBooking.bookingDate = item.bookingDate;
//               newDailyBooking.bookedSeats = scheduleIds[item.balloonSchedule];
//               newDailyBooking.save();
//             }
//         }
//       }
//     }
//    if (this.isModified('status')) {
//     // Only add to history if status was modified
//     this.statusHistory.push({
//       status: this.status,
//       date: new Date(), // Automatically set the current date
//       note: 'Status changed' // Optional: customize notes based on specific status changes
//     });
//   }

//     const promotion = await Promotion.findOne({"code" : order.promotionCode })
//     if (!promotion){
//         // Calculate total amount
//         const total = this.orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
//         const finalAmount = total;
//         order.total = finalAmount >= 0 ? finalAmount : 0; // Ensure totalAmount is not negative

//     }else{
//       // Calculate total amount
//       const total = this.orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
//       let finalAmount = 0; 
//       if(promotion.status === 'Active' && promotion.start <= Date.now() && promotion.end >= Date.now()){ // start and end date check
//         const finalDiscount = (total * promotion.discount) /100 
//         finalAmount = total- finalDiscount;
//       }else{
//         finalAmount = total;
//       }
//       order.total = finalAmount >= 0 ? finalAmount : 0; // Ensure totalAmount is not negative
//   }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });



module.exports = mongoose.model('Order', orderSchema);
