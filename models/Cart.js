const mongoose = require('mongoose');
const Service = require('./Service'); // Assuming the Service model is in the same directory
const Currency = require('./Currency'); // Assuming the Currency model is in the same directory

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
      ride: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide' },
      schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule' },
      quantity: { type: Number, default: 1 },
      price: { type: Number }, // Store price from the Service model
      discount: { type: Number, default: 0 }, // Store discount from Service model
      totalPrice: { type: Number, default: 0 }, // Total price for the item
      currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' }, // Reference to the Currency model
    }
  ]
});

// Middleware to calculate total price before saving the cart
cartSchema.pre('save', async function (next) {
  const cart = this;

  try {
    // all items in the cart
    for (let item of cart.items) {
      if (item.service) {
        // service 
        const service = await Service.findById(item.service);
        if (!service) {
          throw new Error('Service not found');
        }

        // currency 
        const currency = await Currency.findById(item.currency);
        if (!currency) {
          throw new Error('Currency not found');
        }

        // Calculate the price after discount
        const discountAmount = (service.price * service.discount) / 100;
        const discountedPrice = service.price - discountAmount;

        // Convert the price using the exchange rate
        const convertedPrice = discountedPrice * currency.exchangeRate;

        
        item.totalPrice = convertedPrice * item.quantity;

        
        item.price = service.price;
        item.discount = service.discount;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Cart', cartSchema);
