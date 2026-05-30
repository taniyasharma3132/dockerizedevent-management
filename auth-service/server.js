const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'auth-secret-key';

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      success: true,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

// Verify token endpoint
app.post('/api/auth/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is running' });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
