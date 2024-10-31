const express = require('express');
const router = express.Router();
const IsChecked = require('../models/IsChecked'); 
const User = require('../models/User'); 
const BalloonRide = require('../models/BalloonRide'); 

// Create a new checked
router.post('/', async (req, res) => {
  const { user, balloonRide, balloonSchedule } = req.body;

  try {
    const checked = new IsChecked({ user, balloonRide, balloonSchedule });
    await checked.save();
    res.status(201).json(checked);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get by user
router.get('/user/:userId', async (req, res) => {
  try {
    const checkedRecords = await IsChecked.find({ user: req.params.userId })
      .populate('balloonRide')
      .populate('balloonSchedule');
    res.json(checkedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get by balloon schedule ID 
router.get('/schedule/:scheduleId', async (req, res) => {
  try {
    const checkedRecords = await IsChecked.find({ balloonSchedule: req.params.scheduleId })
      .populate('user')
      .populate('balloonRide');

    if (!checkedRecords.length) {
      return res.status(404).json({ message: 'No checked records found for this schedule.' });
    }

    res.json(checkedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a checked 
router.put('/:id', async (req, res) => {
  try {
    const { user, balloonRide, balloonSchedule } = req.body;

    const updatedChecked = await IsChecked.findByIdAndUpdate(
      req.params.id,
      { user, balloonRide, balloonSchedule },
      { new: true }
    );

    if (!updatedChecked) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(updatedChecked);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a checked 
router.delete('/:id', async (req, res) => {
  try {
    const deletedChecked = await IsChecked.findByIdAndDelete(req.params.id);
    if (!deletedChecked) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
