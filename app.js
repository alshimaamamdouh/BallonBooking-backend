const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config(); 

// Import Routes
const companyRoutes = require('./routes/companyRoute');
const serviceRoutes = require('./routes/serviceRoute');
const balloonRideRoutes = require('./routes/balloonRideRoute');
const balloonScheduleRoutes = require('./routes/balloonScheduleRoute');
const orderRoutes = require('./routes/orderRoute');
const cartRoutes = require('./routes/cartRoute');
const wishListRoutes = require('./routes/wishListRoute');
const currencyRoutes = require('./routes/currencyRoute');
const userRoutes = require('./routes/userRoute');
const promotionRoutes = require('./routes/promotionRoute');
const uploadRoutes = require('./routes/uploadRoutes');
// Initialize app
const app = express();



// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
connectDB();


// Use Routes with API Url from .env
const apiVersion = process.env.API_URL ;  

app.use((error, req, res, next) => {
  if (error.isFull) {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

app.use(`/${apiVersion}/company`, companyRoutes);
app.use(`/${apiVersion}/service`, serviceRoutes);
app.use(`/${apiVersion}/balloon-rides`, balloonRideRoutes);
app.use(`/${apiVersion}/balloon-schedule`, balloonScheduleRoutes);
app.use(`/${apiVersion}/orders`, orderRoutes);
app.use(`/${apiVersion}/cart`, cartRoutes);
app.use(`/${apiVersion}/wishlist`, wishListRoutes);
app.use(`/${apiVersion}/currency`, currencyRoutes);
app.use(`/${apiVersion}/user`, userRoutes);
app.use(`/${apiVersion}/promotion`, promotionRoutes);
app.use(`/${apiVersion}/upload`, uploadRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
