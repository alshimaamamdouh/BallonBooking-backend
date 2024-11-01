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

// GET: Get schedule by ride id
router.get('/schedule/:rideId', async (req, res) => {
  try {
    const schedules = await BalloonSchedule.find({ balloonRide: req.params.rideId });
    res.status(200).send(schedules);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve schedules by balloon ride ID', details: error.message });
  }
});

// GET: Get schedule by date
router.get('/schedule_date/:date', async (req, res) => {
  try {

    const dateStr = req.params.date;//'2024-10-31' YYYY-MM-DD format
    
    // Convert string to Date object
    const date = new Date(dateStr);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // Map day number to day name
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dayOfWeek];

    const schedules = await BalloonSchedule.find({ day: dayName });
    res.status(200).send(schedules);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve schedules by Date', details: error.message });
  }
});


// GET: Get schedule by date, time
router.get('/check', async (req, res) => {
  try {

    const dateStr = req.query.date;//'2024-10-31' YYYY-MM-DD format
    
    // Convert string to Date object
    const date = new Date(dateStr);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // Map day number to day name
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dayOfWeek];
    const from = req.query.f_time; // h:m
    const to = req.query.t_time; // h:m
    
    const f_hour = parseInt(from.split(':')[0], 10);
    const f_min = parseInt(from.split(':')[1], 10);

    const t_hour = parseInt(to.split(':')[0], 10);
    const t_min = parseInt(to.split(':')[1], 10);
    
    const schedules = await BalloonSchedule.find({ day: dayName ,"startTime.hours": f_hour,
                                                                "startTime.minutes": f_min ,
                                                                "endTime.hours": t_hour ,
                                                                "endTime.minutes": t_min  });
    if(schedules.length == 0)
    {
      return res.status(200).send({'message':"Not Available"});
    }
    return res.status(200).send({'message':"Available"});
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve schedules by Date', details: error.message });
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
