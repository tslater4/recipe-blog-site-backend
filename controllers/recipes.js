const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token'); // Fixed typo
const User = require('../models/user');
const Recipe = require('../models/recipe');
console.log('this file exists');

// Creating a recipe
router.post("/new-recipe", verifyToken, async (req, res) => {
    try {
        const { title, description, body, image } = req.body;

        const recipe = new Recipe({
            title,
            description,
            body,
            image,
            createdAt: Date.now(),
            originalPoster: req.user._id,
            comments: [], // comments handled seperately
        });

        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;