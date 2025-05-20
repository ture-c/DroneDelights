const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users 
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, address } = req.body;
    
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      username,
      password: hashedPassword,
      name,
      email,
      address
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user._id 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Special case for the required default user
    if (username === 'user' && password === 'password') {
      // Find or create default user
      let defaultUser = await User.findOne({ username: 'user' });
      if (!defaultUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);
        
        defaultUser = new User({
          username: 'user',
          password: hashedPassword,
          name: 'Default User',
          email: 'default@example.com'
        });
        await defaultUser.save();
      }
      
      return res.json({
        message: 'Login successful',
        user: {
          id: defaultUser._id,
          username: defaultUser.username,
          name: defaultUser.name,
          email: defaultUser.email
        }
      });
    }
    
    // login flow
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user favorites
router.patch('/:id/favorites', async (req, res) => {
  try {
    const { itemId, action } = req.body; // action = 'add' or 'remove'
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (action === 'add') {
      // Check if item already in favorites to avoid duplicates
      if (!user.favorites.includes(itemId)) {
        user.favorites.push(itemId);
      }
    } else if (action === 'remove') {
      user.favorites = user.favorites.filter(id => id.toString() !== itemId);
    }
    
    const updatedUser = await user.save();
    res.json({
      message: 'Favorites updated',
      favorites: updatedUser.favorites
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;