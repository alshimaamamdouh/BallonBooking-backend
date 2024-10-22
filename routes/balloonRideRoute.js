const express = require('express');
const BalloonRide = require('../models/BalloonRide');
const router = express.Router();

// POST: Add a balloon ride
router.post('/', async (req, res) => {
  try {
    const balloonRide = new BalloonRide(req.body);
    await balloonRide.save();
    res.status(201).send(balloonRide);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add balloon ride', details: error.message });
  }
});

// GET: Get all balloon rides
router.get('/', async (req, res) => {
  try {
    const rides = await BalloonRide.find();
    res.status(200).send(rides);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve balloon rides', details: error.message });
  }
});

// GET: Get balloon ride by service ID
router.get('/service/:serviceId', async (req, res) => {
  try {
    const rides = await BalloonRide.find({ service: req.params.serviceId });
    res.status(200).send(rides);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve balloon rides by service ID', details: error.message });
  }
});

// PUT: Update a balloon ride by ID
router.put('/:id', async (req, res) => {
  try {
    const ride = await BalloonRide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(ride);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update balloon ride', details: error.message });
  }
});

// DELETE: Delete a balloon ride by ID
router.delete('/:id', async (req, res) => {
  try {
    await BalloonRide.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete balloon ride', details: error.message });
  }
});

module.exports = router;
