const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' })
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_KEY;
// const JWT_SECRET =  "Debjitisasmartb$y";

// Auth Routes
// Create a USER using POST : "/api/auth/createuser" :: Doesn't require authentication -  No login required
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // If there are errors then return the error with bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    // check if the user with this email already exists
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "Sorry an user with the same email already exists" })
        }

        // Hashing the Password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        // Creating a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data = {
            user: {
                id: user.id
            }

        }

        var authtoken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Authenticate a USER using POST : "/api/auth/login" :: Doesn't require authentication -  No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Pasword cannot be blank').exists()
], async (req, res) => {
    let success = false;
    // If there are errors then return the error with bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        // If no user found
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "Please provide correct credentials" })
        }
        // Comparing passwords
        const passwordCompare = await bcrypt.compare(password, user.password);
        // If password doesn't match
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please provide correct credentials" })
        }
        // If correct credentials provided
        const data = {
            user: {
                id: user.id
            }

        }

        var authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


});

// Get Logged in user details using token using POST : "/api/auth/getuser" :: require authentication -  login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;