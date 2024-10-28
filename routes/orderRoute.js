const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();
const sendEmail = require('../email/emailservice');

// POST: Create an order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    const user = await User.findById(req.body.user);
    if (!user) throw new Error('User not found');
    // Send confirmation email
    // const { email } = user.email; // Email of the user placing the order
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
    // const orders = await Order.find().populate('user service ride schedule');
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve orders', details: error.message });
  }
});

// GET: Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve orders for user', details: error.message });
  }
});

// PUT: Update an order by ID
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete order', details: error.message });
  }
});

module.exports = router;
