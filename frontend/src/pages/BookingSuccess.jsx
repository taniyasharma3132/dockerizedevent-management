import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { getEventCategoryLabel } from '../eventCategories';

function BookingSuccess() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return;

            try {
                const res = await api.get(`/api/bookings/${bookingId}`);
                setBooking(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const downloadPass = () => {
        if (!booking) return;

        const passHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventHub Pass - ${booking.event.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .pass-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
        }
        .pass-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .pass-header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .pass-header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .pass-content {
            padding: 30px;
        }
        .pass-section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 5px;
            letter-spacing: 1px;
        }
        .section-value {
            font-size: 18px;
            color: #333;
            font-weight: 600;
        }
        .divider {
            height: 1px;
            background: #eee;
            margin: 20px 0;
        }
        .pass-footer {
            background: #f5f5f5;
            padding: 20px 30px;
            border-top: 1px solid #eee;
        }
        .booking-id, .ticket-id {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
            word-break: break-all;
        }
        .booking-id strong, .ticket-id strong {
            font-weight: bold;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        .detail-label {
            font-weight: 500;
            color: #666;
        }
        .detail-value {
            color: #333;
            font-weight: 600;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .pass-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="pass-container">
        <div class="pass-header">
            <h1>🎉 EventHub Pass</h1>
            <p>Your Event Ticket</p>
        </div>
        
        <div class="pass-content">
            <div class="pass-section">
                <div class="section-title">Event</div>
                <div class="section-value">${booking.event.title}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Category</div>
                <div class="detail-value">${getEventCategoryLabel(booking.event.category)}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Date & Time</div>
                <div class="detail-value">${new Date(booking.event.date).toLocaleString()}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Location</div>
                <div class="detail-value">${booking.event.location}</div>
            </div>

            <div class="divider"></div>

            <div class="pass-section">
                <div class="section-title">Attendee</div>
                <div class="section-value">${booking.user.name}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Email</div>
                <div class="detail-value">${booking.user.email}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Payment Status</div>
                <div class="detail-value">${booking.paymentStatus.toUpperCase()} (${booking.paymentMethod?.toUpperCase()})</div>
            </div>
        </div>

        <div class="pass-footer">
            <div class="booking-id"><strong>Booking ID:</strong> ${booking._id}</div>
            <div class="ticket-id"><strong>Ticket ID:</strong> ${booking.ticketId}</div>
        </div>
    </div>
</body>
</html>`;

        const blob = new Blob([passHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `event-pass-${booking._id}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '6rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>Success</div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--success-color)' }}>Booking Confirmed!</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Your payment is marked complete and your ticket has been booked.
            </p>

            {booking && (
                <div className="pass-preview">
                    <strong>{booking.event.title}</strong>
                    <span>{new Date(booking.event.date).toLocaleString()}</span>
                    <span>{booking.event.location}</span>
                    <span>Payment: {booking.paymentStatus}</span>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {booking && <button type="button" className="btn btn-primary" onClick={downloadPass}>Download Pass</button>}
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                <Link to="/" className="btn btn-secondary">Browse More Events</Link>
            </div>
        </div>
    );
}

export default BookingSuccess;
