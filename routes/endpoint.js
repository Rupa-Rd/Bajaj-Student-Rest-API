const express = require('express');
const router = express.Router();
const User = require('../model/user'); // Adjust the path to your User model

// Getting user data based on "data" array
router.get('/data', async (req, res) => {
    const data = req.query.data ? req.query.data.split(',') : []; // Assuming data is passed as query parameter in URL

    if (data.length === 0) {
        return res.status(400).json({ is_success: false, message: 'Data parameter is required' });
    }

    try {
        // Find users where numbers, alphabets, or highest_alphabet match any element in data array
        const users = await User.find({
            $or: [
                { numbers: { $in: data.map(Number) } }, // Convert data to numbers for comparison
                { alphabets: { $in: data } },
                { highest_alphabet: { $in: data } }
            ]
        });

        if (users.length > 0) {
            const user = users[0]; // Assuming you want to return the first match
            res.json({
                is_success: true,
                user_id: user.user_id,
                email: user.email,
                roll_number: user.roll_number,
                numbers: user.numbers,
                alphabets: user.alphabets,
                highest_alphabet: user.highest_alphabet
            });
        } else {
            res.status(404).json({ is_success: false, message: 'No matching user found' });
        }
    } catch (error) {
        res.status(500).json({ is_success: false, message: error.message });
    }
});

// Creating a User
router.post('/', async (req, res) => {
    const user = new User({
        user_id: req.body.user_id,
        email: req.body.email,
        roll_number: req.body.roll_number,
        numbers: req.body.numbers,
        alphabets: req.body.alphabets,
        highest_alphabet: req.body.highest_alphabet
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
