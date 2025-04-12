const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token'); // Fixed typo
const User = require('../models/user');
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');


// retrieves all comments
router.get("/", verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({});
        if (!comments) {
          return res.status(404).json({ err: 'Comments not found' });
        }
        console.log(comments);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
