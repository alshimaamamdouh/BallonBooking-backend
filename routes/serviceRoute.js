const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// POST: Add a service
router.post('/', async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.status(201).send(service);
});

// GET: Get all services
router.get('/', async (req, res) => {
  const services = await Service.find();
  res.status(200).send(services);
});

// GET: Get service by ID
router.get('/:id', async (req, res) => {
  const service = await Service.findById(req.params.id);
  res.status(200).send(service);
});

// PUT: Update a service by ID
router.put('/:id', async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(service);
});

// DELETE: Delete a service by ID
router.delete('/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
