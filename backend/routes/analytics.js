const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Get analytics (Admin only)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        // Calculate total revenue (confirmed bookings * event price)
        const bookings = await Booking.find({ status: 'confirmed' }).populate('event', ['price']);
        let totalRevenue = 0;
        bookings.forEach(b => {
            if (b.event && b.event.price) {
                totalRevenue += b.event.price;
            }
        });

        res.json({
            totalUsers,
            totalEvents,
            totalBookings,
            totalRevenue
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
