const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
      ride: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide' },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
