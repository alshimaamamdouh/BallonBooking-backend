const express = require('express');
const BalloonRide = require('../models/BalloonRide');
const WishList = require('../models/WishList');
const BalloonSchedule = require('../models/BalloonSchedule');
const isDocumentReferenced = require('../functions/isDocumentReferenced');
const deleteImage = require('../functions/deleteImage');

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

// Create a service
router.post('/rideImage', async (req, res) => {
  try {
      
      const public_ids = req.body.public_ids ? (Array.isArray(req.body.public_ids) ? req.body.public_ids : JSON.parse(req.body.public_ids)) : [];
      const imageUrls = req.body.imageUrls ? (Array.isArray(req.body.imageUrls) ? req.body.imageUrls : JSON.parse(req.body.imageUrls)) : [];
      const location  =  req.body.location ? JSON.parse(req.body.location) : {};
      const newBalloonRide = {
          ...req.body,  
          location: location,
          public_ids: public_ids,
          imageUrls: imageUrls,  
      };

      const balloonRide = new BalloonRide(newBalloonRide);
      const savedballoonRide = await balloonRide.save();
      
      
      res.status(201).json(savedballoonRide);
  } catch (error) {
      
      res.status(400).json({ message: error.message });
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
      const references = [
        { model: WishList, field: 'balloonRide' },
        { model: BalloonSchedule, field: 'balloonRide' }
      ];
        const id_ = req.params.id;
        const isReferenced = await isDocumentReferenced(id_, references);
        if (isReferenced) {
          return res.status(404).send({ error: 'Cannot delete: Balloon Ride is referenced in other collections(WishList Or BalloonSchedule).'});
      }
  
    const balloonRide = await BalloonRide.findByIdAndDelete(req.params.id);
    if (!balloonRide) {
      return res.status(404).send({ error: 'BalloonRide not found' });
    }

    // Delete images 
    const public_ids = balloonRide.public_ids; 
    const public_id = balloonRide.public_id;
    await deleteImage(public_id); 
    if (public_ids && public_ids.length > 0) {
      for (const publicId of public_ids) {
        await deleteImage(publicId); 
      }
    }
    // end delete images
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete balloon ride', details: error.message });
  }
});

module.exports = router;
