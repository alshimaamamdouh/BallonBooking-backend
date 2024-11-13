const DailyBooking = require('../models/DailyBooking');


const checkSeatAvailability = async (balloonScheduleId, date) => {
  
    const dailyBooking = await DailyBooking.findOne({'balloonSchedule': balloonScheduleId, 'bookingDate': date})
    if(dailyBooking)
    {
      return dailyBooking.status;
    }
    return true;
  };
  module.exports = checkSeatAvailability;