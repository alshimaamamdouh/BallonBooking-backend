const mongoose = require('mongoose');
const Cart = require('./Cart');
const Promotion = require('./Promotion');

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
  cart: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cart', 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
    default: 'Pending', 
    required: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Credit Card', 'PayPal', 'Bank Transfer'], 
    required: true 
  },
  promotionCode: { 
    type: String
  },
  transactionId: { 
    type: String 
  },
});

// Middleware to set totalAmount from the associated cart
orderSchema.pre('save', async function(next) {
  const order = this;

  try {
    if (this.isNew) {
      const randomFourDigits = Math.floor(1000 + Math.random() * 9000); // number between 1000 and 9999
      this.orderNumber = `#${randomFourDigits}`;
    }
  

    // Fetch the cart to calculate total amount
    const cart = await Cart.findById(order.cart);
    if (!cart) throw new Error('Cart not found');
    const promotion = await Promotion.findOne({"code" : order.promotionCode })
    if (!promotion) throw new Error('promotion not found');


    // Calculate total amount from cart items and apply discount
    const total = cart.items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
    let finalAmount = 0; 
    if(promotion.status === 'Active'){ // start and end date check
      const finalDiscount = (total * promotion.discount) /100 
      finalAmount = total- finalDiscount;
    }else{
      finalAmount = total;
    }
    order.total = finalAmount >= 0 ? finalAmount : 0; // Ensure totalAmount is not negative

    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('Order', orderSchema);
