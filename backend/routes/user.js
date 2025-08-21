const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.put('/:id', async (req, res) => {
  try {
    const { language, location, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { language, location, avatar }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;