const axios = require('axios');

const exchangeRate = async(currency) => {
    try {
        // Replace with your chosen API's base URL
          const EXCHANGE_API_URL = 'https://v6.exchangerate-api.com/v6';
          const API_KEY = 'dc2bcdab7e47c205b2e54311';
          const response = await axios.get(`${EXCHANGE_API_URL}/${API_KEY}/latest/${currency}`);
        //   response.json({
        //       base: response.data.base_code,
        //       rates: response.data.conversion_rates.EGP,
        //       date: response.data.time_last_update_utc
        //   });
        const value = response.data.conversion_rates.EGP;
        return value;
      } catch (error) {
          return('Error fetching exchange rate');
          
      }
      
    
  };

  module.exports = exchangeRate;