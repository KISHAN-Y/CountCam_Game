const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login validation endpoint
router.post('/users/login', async (req, res) => {
  try {
    // Find user by name
    const user = await User.findOne({ name: req.body.name });
    
    // If user not found or password doesn't match, return error
    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time
    user.lastLogin = Date.now();
    
    // Update streak logic
    const lastLoginDate = new Date(user.lastLogin);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if last login was yesterday to maintain streak
    if (lastLoginDate.toDateString() === yesterday.toDateString()) {
      user.streak += 1;
    } 
    // If not yesterday and not today, reset streak
    else if (lastLoginDate.toDateString() !== today.toDateString()) {
      user.streak = 1;
    }
    
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create/register user
router.post('/users', async (req, res) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ name: req.body.name });
    
    if (!user) {
      // Create new user
      user = new User({
        name: req.body.name,
        password: req.body.password || '',
        role: req.body.role || 'user',
        avatar: req.body.avatar,
        age: req.body.age || null,
        gradeLevel: req.body.gradeLevel || ''
      });
      
      // If this is a new user with preferences, add them
      if (req.body.preferences) {
        user.preferences = req.body.preferences;
      }
    } else {
      // If user exists but no password is set (for backward compatibility)
      if (!user.password && req.body.password) {
        user.password = req.body.password;
      }
      
      // Update existing user
      user.lastLogin = Date.now();
      user.avatar = req.body.avatar || user.avatar;
      
      // Update streak logic
      const lastLoginDate = new Date(user.lastLogin);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if last login was yesterday to maintain streak
      if (lastLoginDate.toDateString() === yesterday.toDateString()) {
        user.streak += 1;
      } 
      // If not yesterday and not today, reset streak
      else if (lastLoginDate.toDateString() !== today.toDateString()) {
        user.streak = 1;
      }
    }
    
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user
router.patch('/users/:id', async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add game to user history
router.post('/users/:id/games', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.gameHistory.push({
      gameType: req.body.gameType,
      score: req.body.score,
      date: new Date()
    });
    
    // Update stars based on game score
    user.stars += req.body.score;
    
    // Update badges logic (simplified)
    if (user.gameHistory.length % 5 === 0) {
      user.badges += 1;
    }
    
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
