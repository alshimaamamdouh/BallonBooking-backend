const express = require('express');
const Promotion = require('../models/Promotion');
const router = express.Router();

// POST: Add a promotion
router.post('/', async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).send(promotion);
  } catch (error) {
    res.status(400).send({ error: 'Failed to add promotion', details: error.message });
  }
});

// GET: Get all promotions
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).send(promotions);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve promotions', details: error.message });
  }
});

// GET: Get promotion by ID
router.get('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).send({ error: 'Promotion not found' });
    }
    res.status(200).send(promotion);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve promotion', details: error.message });
  }
});

// PUT: Update a promotion by ID
router.put('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) {
      return res.status(404).send({ error: 'Promotion not found' });
    }
    res.status(200).send(promotion);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update promotion', details: error.message });
  }
});

// DELETE: Delete a promotion by ID
router.delete('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).send({ error: 'Promotion not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete promotion', details: error.message });
  }
});

module.exports = router;
