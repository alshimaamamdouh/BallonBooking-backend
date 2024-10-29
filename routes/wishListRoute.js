const express = require('express');
const Wishlist = require('../models/WishList');
const router = express.Router();

// POST: Add items to wishlist
router.post('/', async (req, res) => {
  try {
    const wishlist = new Wishlist(req.body);
    await wishlist.save();
    res.status(201).send(wishlist);
  } catch (error) {
    res.status(400).send({ error: 'Failed to add items to wishlist', details: error.message });
  }
});

// GET: Get wishlist by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId });
    if (!wishlist) {
      return res.status(404).send({ error: 'Wishlist not found for this user' });
    }
    res.status(200).send(wishlist);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve wishlist', details: error.message });
  }
});

// PUT: Update wishlist by user ID
router.put('/user/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true });
    if (!wishlist) {
      return res.status(404).send({ error: 'Wishlist not found for this user' });
    }
    res.status(200).send(wishlist);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update wishlist', details: error.message });
  }
});

// DELETE: Clear wishlist by user ID
router.delete('/user/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndDelete({ user: req.params.userId });
    if (!wishlist) {
      return res.status(404).send({ error: 'Wishlist not found for this user' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to clear wishlist', details: error.message });
  }
});

module.exports = router;
