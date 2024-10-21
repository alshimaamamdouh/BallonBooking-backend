const express = require('express');
const Wishlist = require('../models/Wishlist');
const router = express.Router();

// POST: Add items to wishlist
router.post('/', async (req, res) => {
  const wishlist = new Wishlist(req.body);
  await wishlist.save();
  res.status(201).send(wishlist);
});

// GET: Get wishlist by user ID
router.get('/user/:userId', async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.params.userId });
  res.status(200).send(wishlist);
});

// PUT: Update wishlist by user ID
router.put('/user/:userId', async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true });
  res.status(200).send(wishlist);
});

// DELETE: Clear wishlist by user ID
router.delete('/user/:userId', async (req, res) => {
  await Wishlist.findOneAndDelete({ user: req.params.userId });
  res.status(204).send();
});

module.exports = router;
