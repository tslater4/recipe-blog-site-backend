const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewear/verify-token');
const User = require('../models/user');

router.get('/:userId', verifyToken, async (req, res) => {
    console.log(req.user);
  try {
    if (req.user._id !== req.params.userId){
        return res.status(403).json({ err: "Unauthorized"});
      }
    const user = await User.find({}, "username");
    if (!user) {
        return res.status(404).json({ err: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;