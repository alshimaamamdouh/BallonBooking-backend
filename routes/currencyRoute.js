const express = require('express');
const Currency = require('../models/Currency');
const router = express.Router();

// POST: Add a new currency
router.post('/', async (req, res) => {
  const currency = new Currency(req.body);
  await currency.save();
  res.status(201).send(currency);
});

// GET: Get all currencies
router.get('/', async (req, res) => {
  const currencies = await Currency.find();
  res.status(200).send(currencies);
});

// GET: Get a currency by code
router.get('/:code', async (req, res) => {
  const currency = await Currency.findOne({ code: req.params.code });
  res.status(200).send(currency);
});

// PUT: Update a currency by code
router.put('/:code', async (req, res) => {
  const currency = await Currency.findOneAndUpdate({ code: req.params.code }, req.body, { new: true });
  res.status(200).send(currency);
});

// DELETE: Delete a currency by code
router.delete('/:code', async (req, res) => {
  await Currency.findOneAndDelete({ code: req.params.code });
  res.status(204).send();
});

module.exports = router;
