const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// POST: Add a service
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).send(service);
  } catch (error) {
    res.status(400).send({ error: 'Failed to add service', details: error.message });
  }
});

// GET: Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).send(services);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve services', details: error.message });
  }
});

// GET: Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send({ error: 'Service not found' });
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve service', details: error.message });
  }
});

// PUT: Update a service by ID
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).send({ error: 'Service not found' });
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update service', details: error.message });
  }
});

// DELETE: Delete a service by ID
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).send({ error: 'Service not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete service', details: error.message });
  }
});

module.exports = router;
