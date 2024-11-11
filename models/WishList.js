const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      balloonRide: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide' },
      addedAt: { type: Date, default: Date.now },
      lastModified: { type: Date, default: Date.now }
    }
  ]
});

wishlistSchema.index({ user: 1, 'items.balloonRide': 1 }, { unique: true });

// Indexing fields for quicker queries
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.balloonRide': 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
