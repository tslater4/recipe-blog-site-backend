const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const saltRounds = 12; // level of padding given to pre-encrypted password

// allows creation of new account if username is not taken
router.post('/sign-up', async (req, res) => {
    try {
        console.log(req.body); // debugging line
        const userInDatabase = await User.findOne({ username: req.body.username });

        if (userInDatabase) {
            return res.status(409).json({err:'Username already exists'});
        }
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
        });
        const payload = { username: user.username, _id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ err: error.message });
        }
    });

// Checks for existing username, 
// if it exists, checks password. If password is correct, signs JWT token and sends.
router.post('/sign-in', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ err: 'Invalid username or password' });
        }
        const passwordCorrect = await bcrypt.compare(req.body.password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ err: 'Invalid username or password' });
        }
        const payload = { username: user.username, _id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
});

module.exports = router;