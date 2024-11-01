const express = require('express');
const Currency = require('../models/Currency');
const axios = require('axios');
const router = express.Router(); 
const exchangeRate = require('../functions/exchangeRate');


// POST: Add a new currency
router.post('/', async (req, res) => {
  try {
    const currency = new Currency(req.body);
    await currency.save();
    res.status(201).send(currency);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add currency', details: error.message });
  }
});

// GET: Get all currencies
router.get('/', async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.status(200).send(currencies);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve currencies', details: error.message });
  }
});

// GET: Get a currency by code
router.get('/:code', async (req, res) => {
  try {
    const currency = await Currency.findOne({ code: req.params.code });
    if (!currency) {
      return res.status(404).send({ error: 'Currency not found' });
    }
    res.status(200).send(currency);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve currency', details: error.message });
  }
});

// PUT: Update a currency by code
router.put('/:code', async (req, res) => {
  try {
    const currency = await Currency.findOneAndUpdate({ code: req.params.code }, req.body, { new: true });
    if (!currency) {
      return res.status(404).send({ error: 'Currency not found' });
    }
    res.status(200).send(currency);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update currency', details: error.message });
  }
});

// DELETE: Delete a currency by code
router.delete('/:code', async (req, res) => {
  try {
    const currency = await Currency.findOneAndDelete({ code: req.params.code });
    if (!currency) {
      return res.status(404).send({ error: 'Currency not found' });
    }
    res.status(204).send({details :"Record is deleted successfully"});
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete currency', details: error.message });
  }
});




// Endpoint to get exchange rates
router.get('/exchange-rate/:currency', async (req, res) => {
    const { currency } = req.params; // Example: 'USD'
    const rate = await exchangeRate(currency);
    res.status(200).json({ message: String(rate) });
});

module.exports = router;
