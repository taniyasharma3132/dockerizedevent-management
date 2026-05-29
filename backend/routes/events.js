const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all events with optional search/filtering
router.get('/', async (req, res) => {
    try {
        const { search, location, category } = req.query;
        let query = {};
        
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (category && category !== 'all') {
            query.category = category;
        }

        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create event (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    try {
        const newEvent = new Event({
            ...req.body,
            createdBy: req.user.id
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update event (Admin only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(event);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete event (Admin only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Event deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
