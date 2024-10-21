const express = require('express');
const BalloonSchedule = require('../models/BalloonSchedule');
const router = express.Router();

// POST: Add a balloon schedule
router.post('/', async (req, res) => {
  const schedule = new BalloonSchedule(req.body);
  await schedule.save();
  res.status(201).send(schedule);
});

// GET: Get all schedules
router.get('/', async (req, res) => {
  const schedules = await BalloonSchedule.find().populate('balloonRide');
  res.status(200).send(schedules);
});

// GET: Get schedule by balloon ride ID
router.get('/ride/:rideId', async (req, res) => {
  const schedules = await BalloonSchedule.find({ balloonRide: req.params.rideId });
  res.status(200).send(schedules);
});

// PUT: Update a schedule by ID
router.put('/:id', async (req, res) => {
  const schedule = await BalloonSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(schedule);
});

// DELETE: Delete a schedule by ID
router.delete('/:id', async (req, res) => {
  await BalloonSchedule.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
