const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token');
const User = require('../models/user');

// grabs every user from the database
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "username recipes");
    if (!users) {
      return res.status(404).json({ err: 'Users not found' });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// grabs a specific user from the database
router.get('/:userId', verifyToken, async (req, res) => {
    console.log(req.user);
  try {
    const user = await User.find({}, "username recipes");
    if (!user) {
        return res.status(404).json({ err: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;