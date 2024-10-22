const express = require('express');
const Company = require('../models/Company');
const router = express.Router();

// POST: Add a company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).send(company);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add company', details: error.message });
  }
});

// GET: Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve companies', details: error.message });
  }
});

// PUT: Update a company by ID
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update company', details: error.message });
  }
});

// DELETE: Delete a company by ID
router.delete('/:id', async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete company', details: error.message });
  }
});

module.exports = router;
