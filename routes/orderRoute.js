const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const BalloonSchedule = require('../models/BalloonSchedule');
const BalloonRide = require('../models/BalloonRide');
const router = express.Router();
const sendEmail = require('../email/emailservice');

const checkSeatAvailability = async (balloonScheduleId, seatsRequested) => {
  const schedule = await BalloonSchedule.findById(balloonScheduleId);
  if (!schedule) throw new Error('Schedule not found');

  // Check if requested seats exceed available seats
  return (seatsRequested <= schedule.emptySeats)
};

const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    const schedule = await BalloonSchedule.findById(order.balloonSchedule);
    if (schedule) {
      schedule.bookedSeats -= order.seatsRequested;
      await schedule.save();
    }

  } catch (error) {
    throw new Error('Order Not Canceled');
  }
};


// POST: Create an order
router.post('/', async (req, res) => {
  try {
   
    const user = await User.findById(req.body.user);
    if (!user) throw new Error('User not found');
    const cart = await User.findById(req.body.cart);
    if (!cart) throw new Error('Cart not found');

    let allSeatsAvailable = true; // Flag to check availability

    // Loop through the items to check availability
    for (const item of cart.items) {
      let seatsRequested = item.adult + item.child; // Adjust based on your logic for seat requests

      const isAvailable = await checkSeatAvailability(item.schedule, seatsRequested);
      if (!isAvailable) {
        allSeatsAvailable = false; // Set the flag to false if any item is not available
        return res.status(400).send({
          error: `Not enough seats available for the service: ${item.schedule.balloonRide.title}`
        });
      }
    }
    
    
    const order = new Order(req.body);
    await order.save();

    // Send confirmation email
    const { email } = user.email; // Email of the user placing the order
    const subject = 'Order Confirmation';
    const text = `Thank you for your order. Your order number is ${order.orderNumber}.`;
    const html = `<p>Thank you for your order. Your order number is <strong>${order.orderNumber}</strong>.</p>`;
    await sendEmail(user.email, subject, text, html);


    res.status(201).send(order);
  } catch (error) {
    res.status(400).send({ error: 'Failed to create order', details: error.message });
  }
});

// GET: Get all orders
router.get('/', async (req, res) => {
  try {
    
      const orders = await Order.find()
      .populate('user')  
      .populate({ 
        path: 'cart', 
        populate: [{ path: 'items.service' }, { path: 'items.currency' } ]   });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve orders', details: error.message });
  }
});


// GET: Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId })
    .populate('user')  
    .populate({ 
      path: 'cart', 
      populate: [{ path: 'items.service' }, { path: 'items.currency' } ]   });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve orders for user', details: error.message });
  }
});

// PUT: Update an order by ID
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(order && order.status == 'Cancelled'){
      cancelOrder(req.params.id);
    }
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update order', details: error.message });
  }
});

// DELETE: Delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if(order)
    {
      cancelOrder(req.params.id)
    }
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete order', details: error.message });
  }
});

module.exports = router;
