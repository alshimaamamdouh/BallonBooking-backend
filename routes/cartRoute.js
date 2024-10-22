const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// POST: Add items to cart
router.post('/', async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add items to cart', details: error.message });
  }
});

// GET: Get cart by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve cart', details: error.message });
  }
});

// PUT: Update cart by user ID
router.put('/user/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update cart', details: error.message });
  }
});

// DELETE: Clear cart by user ID
router.delete('/user/:userId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.params.userId });
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to clear cart', details: error.message });
  }
});

module.exports = router;
