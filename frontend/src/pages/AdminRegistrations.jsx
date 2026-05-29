import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

function AdminRegistrations() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    const fetchBookings = useCallback(async () => {
        try {
            const res = await api.get('/api/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchBookings();
    }, [user, navigate, fetchBookings]);

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1>Admin: Manage Registrations</h1>
            <p style={{ color: 'var(--text-muted)' }}>View all user bookings across all events.</p>

            <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse', backgroundColor: 'var(--surface-color)' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>User Name</th>
                        <th style={{ padding: '1rem' }}>User Email</th>
                        <th style={{ padding: '1rem' }}>Event Title</th>
                        <th style={{ padding: '1rem' }}>Booking Date</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem' }}>{booking.user?.name || 'N/A'}</td>
                            <td style={{ padding: '1rem' }}>{booking.user?.email || 'N/A'}</td>
                            <td style={{ padding: '1rem' }}>{booking.event?.title || 'Unknown Event'}</td>
                            <td style={{ padding: '1rem' }}>{new Date(booking.bookingDate).toLocaleString()}</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.875rem',
                                    backgroundColor: booking.status === 'confirmed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: booking.status === 'confirmed' ? 'var(--success-color)' : 'var(--danger-color)'
                                }}>
                                    {booking.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {bookings.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No registrations found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminRegistrations;
