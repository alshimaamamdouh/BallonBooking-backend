const axios = require('axios');

const currencyCodes = async() => {
    try {
        // Replace with your chosen API's base URL
          const EXCHANGE_API_URL = 'https://v6.exchangerate-api.com/v6';
          const API_KEY = 'dc2bcdab7e47c205b2e54311';
          const currency = 'USD'
          const response = await axios.get(`${EXCHANGE_API_URL}/${API_KEY}/latest/${currency}`);
        // Return an array of currency codes
        const currencyCodes = Object.keys(response.data.conversion_rates);

        return currencyCodes;
    

      } catch (error) {
          return('Error fetching exchange rate');
          
      }
      
    
  };

  module.exports = currencyCodes;