const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3002;

// Mock events database
let events = [
  { id: 1, title: 'Tech Conference 2024', date: '2024-06-15', category: 'Technology' },
  { id: 2, title: 'Music Festival', date: '2024-07-20', category: 'Entertainment' }
];

// Get all events
app.get('/api/events', (req, res) => {
  res.json({ success: true, data: events });
});

// Get event by ID
app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json({ success: true, data: event });
});

// Create new event
app.post('/api/events', (req, res) => {
  try {
    const { title, date, category } = req.body;
    
    if (!title || !date || !category) {
      return res.status(400).json({ message: 'Title, date, and category required' });
    }

    const newEvent = {
      id: events.length + 1,
      title,
      date,
      category
    };
    
    events.push(newEvent);
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// Update event
app.put('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  Object.assign(event, req.body);
  res.json({ success: true, data: event });
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  const deleted = events.splice(index, 1);
  res.json({ success: true, data: deleted[0] });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Event Service is running' });
});

app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);
});
