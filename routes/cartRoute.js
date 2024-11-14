const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const isDocumentReferenced = require('../functions/isDocumentReferenced');
const checkSeatAvailability = require('../functions/checkSeatAvailability');
const checkSchedule = require('../functions/checkSchedule');

const router = express.Router();

// POST: Add items to cart
router.post('/', async (req, res) => {
  try {
    const { user, items } = req.body;
    for(const item of items){
      if(!checkSeatAvailability(item.balloonSchedule, item.bookingDate)){
         item.status = 'Sold Out'; 
      }
    }
    
    // Check if user is logged in (example check based on userId)
    if (!user) {
      // If user is not logged in, store cart data in cookie
      let cart = req.cookies.cart || [];
          
      cart.push(...items); // Add new items to the existing cart in cookies
      
      // Set cookie to expire in 30 days
      res.cookie('cart', cart, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(201).send({ message: 'Items added to cart cookie', cart });
    }
  
    // add cookies for old cart for same user
    const userCart = await Cart.findOne({'user':user});
    if(userCart){
      if(req.cookies.cart.length > 0)
      {
        // userCart.items.push(...req.cookies.cart);
        for(const item of req.cookies.cart){
          userCart.items = await checkSchedule(userCart.items,item);
        }
      }
      for(const item of req.body.items){
        userCart.items = await checkSchedule(userCart.items,item);
      }
      await userCart.save();
    }else{
    const cart = new Cart(req.body);
    await cart.save()
    }
    ;
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add items to cart', details: error.message });
  }
});

// Add an item to the cart
router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const userId = data.user;
    
    for(const item of data.items){
      if(!checkSeatAvailability(item.balloonSchedule, item.bookingDate)){
         item.status = 'Sold Out'; 
      }
    }
    // Find or create the cart by user
    let cart = await Cart.findOne({ "user" : userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find(item => item.balloonSchedule.equals(data.items.balloonSchedule));
    if (existingItem) {
      existingItem.adult += parseInt(data.items.adult);
      existingItem.child += parseInt(data.items.child);
    } else {
      cart.items.push({data});
    }
    
    if (!userId) {
      // If user is not logged in, store cart data in cookie
      let cart = req.cookies.cart || [];
      cart.push(...data); // Add new items to the existing cart in cookies
      
      // Set cookie to expire in 30 days
      res.cookie('cart', cart, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(201).send({ message: 'Items added to cart cookie', cart });
    }

    // Save the cart and calculate the total price
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET: Get cart by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve cart', details: error.message });
  }
});

// GET: Get cart by user ID
router.get('/checkSeats/:cartId', async (req, res) => {
  try {
        if(req.params.cartId === 0){
          let cart = req.cookies.cart || [];
          for(const item of cart.items){
            if(!checkSeatAvailability(item.balloonSchedule, item.bookingDate)){
               item.status = 'Sold Out'; 
            }
        }
        res.send(cart);
      }
        else{
    const cart = await Cart.findById(req.params.cartId );
    
    for(const item of cart.items){
     if(!checkSeatAvailability(item.balloonSchedule, item.bookingDate)){
        item.status = 'Sold Out';
     };
    }
    res.send(cart);
  
}
    res.send('No Cart Or Cookies Available');
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve cart', details: error.message });
  }
});

// PUT: Update cart by user ID
router.put('/user/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update cart', details: error.message });
  }
});

// DELETE: Clear cart by user ID
router.delete('/clear/:userId', async (req, res) => {y
  try {

    const { userId } = req.params;

    // If user is not logged in, clear the cart cookie
    if (!userId) {
      res.clearCookie('cart'); // Clear cookie named 'cart'
      return res.status(204).send({ message: 'Cart cleared from cookies' });
    }

    const cart = await Cart.findOneAndDelete({ user: req.params.userId });
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Failed to clear cart', details: error.message });
  }
});

// Delete item from the cart
router.delete('/removeitem', async (req, res) => {
  try {
    const { userId, balloonScheduleId } = req.body;

    // find the cart for the user
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // remove the item from the cart
    cart.items = cart.items.filter(item => !item.balloonSchedule.equals(balloonScheduleId));

    // save the cart and calculate the total price
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
