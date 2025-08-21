const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Fetch messages between two users
router.get('/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const messages = await Message.find({ $or: [{ from, to }, { from: to, to: from }] }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;