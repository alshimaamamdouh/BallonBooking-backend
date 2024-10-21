const express = require('express');
const BalloonRide = require('../models/BalloonRide');
const router = express.Router();

// POST: Add a balloon ride
router.post('/', async (req, res) => {
  const balloonRide = new BalloonRide(req.body);
  await balloonRide.save();
  res.status(201).send(balloonRide);
});

// GET: Get all balloon rides
router.get('/', async (req, res) => {
  const rides = await BalloonRide.find();
  res.status(200).send(rides);
});

// GET: Get balloon ride by service ID
router.get('/service/:serviceId', async (req, res) => {
  const rides = await BalloonRide.find({ service: req.params.serviceId });
  res.status(200).send(rides);
});

// PUT: Update a balloon ride by ID
router.put('/:id', async (req, res) => {
  const ride = await BalloonRide.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(ride);
});

// DELETE: Delete a balloon ride by ID
router.delete('/:id', async (req, res) => {
  await BalloonRide.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
