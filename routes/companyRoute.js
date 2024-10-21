const express = require('express');
const Company = require('../models/Company');
const router = express.Router();

// POST: Add a company
router.post('/', async (req, res) => {
  const company = new Company(req.body);
  await company.save();
  res.status(201).send(company);
});

// GET: Get all companies
router.get('/', async (req, res) => {
  const companies = await Company.find();
  res.status(200).send(companies);
});

// PUT: Update a company by ID
router.put('/:id', async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(company);
});

// DELETE: Delete a company by ID
router.delete('/:id', async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
