const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const isDocumentReferenced = require('../functions/isDocumentReferenced');
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
    const references = [
      { model: Order, field: 'cart' }
    ];
      const id_ = req.params.id;
      const isReferenced = await isDocumentReferenced(id_, references);
      if (isReferenced) {
        return res.status(404).send({ error: 'Cannot delete: Cart is referenced in other collections(Order).'});
    }
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to clear cart', details: error.message });
  }
});

module.exports = router;
