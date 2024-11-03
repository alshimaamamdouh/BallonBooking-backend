const mongoose = require('mongoose');
const BalloonSchedule = require('./BalloonSchedule'); // Assuming the Service model is in the same directory
const Currency = require('./Currency'); // Assuming the Currency model is in the same directory
const BalloonRide = require('./BalloonRide');
const exchangeRate = require('../functions/exchangeRate');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
      schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule' },
      adult: { type: Number, required: true, min: 0},
      child: { type: Number, required: true, min: 0 },
      totalPrice: { type: Number, default: 0 }, // Total price for the item
      currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' }, // Reference to the Currency model
    }
  ]
});

cartSchema.index({ user: 1 }); // Index for faster querying by user

// Middleware to calculate total price before saving the cart
cartSchema.pre('save', async function (next) {
  const cart = this;

  try {
    // all items in the cart
    for (let item of cart.items) {
      if (item.schedule) {
        // schedule 
        const schedule = await BalloonSchedule.findById(item.schedule);
        if (!schedule) {
          throw new Error('Schedule not found');
        }
        // ride 
        const balloonRide = await BalloonRide.findById(schedule.balloonRide);
        if (!balloonRide) {
          throw new Error('Balloon Ride not found');
        }
        // currency 
        const currency = await Currency.findById(item.currency);
        if (!currency) {
          throw new Error('Currency not found');
        }

        // Calculate the price after discount
        const discountAmountAdult = (balloonRide.adultPrice * balloonRide.discount) / 100;
        const discountedPriceAdult = balloonRide.adultPrice - discountAmountAdult;

        const discountAmountChild = (balloonRide.childPrice * balloonRide.discount) / 100;
        const discountedPriceChild = balloonRide.childPrice - discountAmountChild;
        const { currencyCode } = currency.code; // Example: 'USD'
        const rate = await exchangeRate(currencyCode);
        res.status(200).json({ message: String(rate) });
        item.totalPrice = ((discountedPriceAdult * item.adult) + (discountedPriceChild * item.child)) * rate;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Cart', cartSchema);
