const express = require('express');
const router = express.Router();
const User = require('../models/User');
const WishList = require('../models/WishList');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs'); // encryption for password
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth'); //  auth middleware
const isDocumentReferenced = require('../functions/isDocumentReferenced');

// public - Register a user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({ name, email, passwordHash: hashedPassword, isAdmin });
    await user.save();

    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// public - Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Invalid email or password');

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).send('Invalid email or password');

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Check for existing cart data in cookies
    let cartData = req.cookies.cart || [];
    
    // Clear the cart cookie (optional, if you want to delete it after saving in DB)
    res.clearCookie('cart');

    // Send the token, name, isAdmin, and email
    res.send({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
      cart: cartData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
});


// protected - Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) return res.status(404).send('User not found');

    res.send(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// protected - Get all users
router.get('/', authMiddleware,  async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash'); // Exclude password
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});


// protected - Delete a user
router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    const references = [
      { model: WishList, field: 'user' },
      { model: Cart, field: 'user' },
      { model: Order, field: 'user' }
    ];
 
    const id_ = req.params.userId;
    const isReferenced = await isDocumentReferenced(id_, references);
    if (isReferenced) {
      return res.status(404).send({ error: 'Cannot delete: User is referenced in other collections(WishList Or Cart Or Order).'});
  }
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    res.send('User deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
