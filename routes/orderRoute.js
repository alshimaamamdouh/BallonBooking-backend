const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// POST: Create an order
router.post('/', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).send(order);
});

// GET: Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('user service ride schedule');
  res.status(200).send(orders);
});

// GET: Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  const orders = await Order.find({ user: req.params.userId });
  res.status(200).send(orders);
});

// PUT: Update an order by ID
router.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(order);
});

// DELETE: Delete an order by ID
router.delete('/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
