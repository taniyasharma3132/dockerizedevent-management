const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const userResponse = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
});

const signToken = (user) => {
    const payload = { user: { id: user.id, role: user.role } };
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 });
};

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Name, email, and password are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name: name.trim(), email: normalizedEmail, password, role });
        await user.save();

        res.json({ token: signToken(user), user: userResponse(user) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error while registering user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        let user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        res.json({ token: signToken(user), user: userResponse(user) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error while logging in' });
    }
});

// Current logged-in user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({ user: userResponse(user) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error while loading user' });
    }
});

module.exports = router;
