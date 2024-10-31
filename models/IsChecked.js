const mongoose = require('mongoose');

const isCheckedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  balloonRide: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonRide', required: true }, 
  balloonSchedule: { type: mongoose.Schema.Types.ObjectId, ref: 'BalloonSchedule', required: true },
  availableseats: {type: Number, default: 0, require: true},
  checkedAt: { type: Date, default: Date.now } 

});

module.exports = mongoose.model('IsChecked', isCheckedSchema);
