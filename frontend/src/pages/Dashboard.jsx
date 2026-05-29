import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import { Link } from 'react-router-dom';
import api from '../api';

function Dashboard() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user?.role === 'admin') {
                    const res = await api.get('/api/analytics');
                    setAnalytics(res.data);
                } else if (user) {
                    const res = await api.get('/api/bookings');
                    setBookings(res.data);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="container">
            <h1 style={{ marginTop: '2rem' }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name || 'User'}!</p>

            <div style={{ marginTop: '2rem' }}>
                {user?.role === 'admin' ? (
                    <div>
                        <h2>Admin Controls & Analytics</h2>
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <div className="analytics-value">{analytics?.totalUsers || 0}</div>
                                <div className="analytics-label">Total Users</div>
                            </div>
                            <div className="analytics-card">
                                <div className="analytics-value">{analytics?.totalEvents || 0}</div>
                                <div className="analytics-label">Active Events</div>
                            </div>
                            <div className="analytics-card">
                                <div className="analytics-value">{analytics?.totalBookings || 0}</div>
                                <div className="analytics-label">Total Bookings</div>
                            </div>
                            <div className="analytics-card">
                                <div className="analytics-value">${analytics?.totalRevenue?.toLocaleString() || 0}</div>
                                <div className="analytics-label">Total Revenue</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <Link to="/admin/events" className="btn btn-primary">Manage Events (Add/Edit/Delete)</Link>
                            <Link to="/admin/registrations" className="btn btn-secondary">View All Registrations</Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>My Bookings</h2>
                        {bookings.length === 0 ? (
                            <>
                                <p>You haven't booked any events yet.</p>
                                <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Browse Events</Link>
                            </>
                        ) : (
                            <div className="event-grid">
                                {bookings.map(booking => (
                                    <div key={booking._id} className="event-card">
                                        <div className="event-content">
                                            <h3 className="event-title">{booking.event?.title || 'Unknown Event'}</h3>
                                            <div className="event-meta">
                                                📅 {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'} <br/>
                                                📍 {booking.event?.location || 'N/A'} <br/>
                                                Status: {booking.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
