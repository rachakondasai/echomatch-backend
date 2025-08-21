const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// Signup
router.post('/signup', async (req, res) => {
  const { name, mobile, gender, location, language, password } = req.body;
  try {
    const existing = await User.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Name already taken' });

    const hashed = await hashPassword(password);
    const user = new User({ name, mobile, gender, location, language, password: hashed, isOnline: false });
    await user.save();
    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ msg: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;