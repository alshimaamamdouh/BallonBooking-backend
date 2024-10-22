const express = require('express');
const BalloonSchedule = require('../models/BalloonSchedule');
const router = express.Router();

// POST: Add a balloon schedule
router.post('/', async (req, res) => {
  try {
    const schedule = new BalloonSchedule(req.body);
    await schedule.save();
    res.status(201).send(schedule);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add balloon schedule', details: error.message });
  }
});

// GET: Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await BalloonSchedule.find().populate('balloonRide');
    res.status(200).send(schedules);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve schedules', details: error.message });
  }
});

// GET: Get schedule by balloon ride ID
router.get('/ride/:rideId', async (req, res) => {
  try {
    const schedules = await BalloonSchedule.find({ balloonRide: req.params.rideId });
    res.status(200).send(schedules);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve schedules by balloon ride ID', details: error.message });
  }
});

// PUT: Update a schedule by ID
router.put('/:id', async (req, res) => {
  try {
    const schedule = await BalloonSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(schedule);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update schedule', details: error.message });
  }
});

// DELETE: Delete a schedule by ID
router.delete('/:id', async (req, res) => {
  try {
    await BalloonSchedule.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete schedule', details: error.message });
  }
});

module.exports = router;
