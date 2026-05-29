const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get bookings for a user, or all for admin
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const bookings = await Booking.find()
                .populate('user', ['name', 'email'])
                .populate('event', ['title', 'date', 'category']);
            return res.json(bookings);
        }
        const bookings = await Booking.find({ user: req.user.id })
            .populate('event', ['title', 'date', 'location', 'category', 'price']);
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get a single booking for pass download
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', ['name', 'email'])
            .populate('event', ['title', 'date', 'location', 'category', 'price']);

        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        const isOwner = booking.user._id.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        res.json(booking);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create a booking
router.post('/', auth, async (req, res) => {
    try {
        const { eventId, paymentMethod = 'upi', paymentStatus = 'paid', transactionId } = req.body;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Basic capacity check
        const bookingsCount = await Booking.countDocuments({ event: eventId, status: 'confirmed' });
        if (bookingsCount >= event.capacity) {
            return res.status(400).json({ msg: 'Event is fully booked' });
        }

        const newBooking = new Booking({
            user: req.user.id,
            event: eventId,
            paymentMethod,
            paymentStatus,
            transactionId
        });
        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error('Booking creation error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
