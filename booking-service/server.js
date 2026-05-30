const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3003;
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://event-service:3002';

// Mock bookings database
let bookings = [];

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  res.json({ success: true, data: booking });
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, eventId, numberOfTickets } = req.body;
    
    if (!userId || !eventId || !numberOfTickets) {
      return res.status(400).json({ message: 'UserId, eventId, and numberOfTickets required' });
    }

    // Verify event exists (call Event Service)
    try {
      await axios.get(`${EVENT_SERVICE_URL}/api/events/${eventId}`);
    } catch (error) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newBooking = {
      id: bookings.length + 1,
      userId,
      eventId,
      numberOfTickets,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Cancel booking
app.delete('/api/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  const cancelled = bookings.splice(index, 1);
  cancelled[0].status = 'cancelled';
  res.json({ success: true, data: cancelled[0] });
});

// Get bookings by user
app.get('/api/bookings/user/:userId', (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.params.userId);
  res.json({ success: true, data: userBookings });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Booking Service is running' });
});

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
