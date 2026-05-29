const mongoose = require('mongoose');
const crypto = require('crypto');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketId: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(10).toString('hex')
    },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'paid' },
    paymentMethod: { type: String, enum: ['upi', 'cash', 'card'], default: 'upi' },
    transactionId: { type: String },
    bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
