const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// POST: Add items to cart
router.post('/', async (req, res) => {
  const cart = new Cart(req.body);
  await cart.save();
  res.status(201).send(cart);
});

// GET: Get cart by user ID
router.get('/user/:userId', async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId });
  res.status(200).send(cart);
});

// PUT: Update cart by user ID
router.put('/user/:userId', async (req, res) => {
  const cart = await Cart.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true });
  res.status(200).send(cart);
});

// DELETE: Clear cart by user ID
router.delete('/user/:userId', async (req, res) => {
  await Cart.findOneAndDelete({ user: req.params.userId });
  res.status(204).send();
});

module.exports = router;
