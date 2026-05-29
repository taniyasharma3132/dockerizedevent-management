import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/auth';
import { getEventCategoryLabel } from '../eventCategories';

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/api/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBookEvent = async () => {
        if (authLoading) return;

        if (!user) {
            alert('Please login to book an event!');
            navigate('/login');
            return;
        }
        navigate(`/payment/${event._id}`);
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading event details...</div>;
    if (!event) return <div className="container" style={{ marginTop: '2rem' }}>Event not found.</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface-color)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {event.imageUrl && (
                    <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '2rem' }}>
                    <span className="event-category">{getEventCategoryLabel(event.category)}</span>
                    <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{event.title}</h1>
                    <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        <span>📅 {new Date(event.date).toLocaleString()}</span>
                        <span>📍 {event.location}</span>
                        <span>🎟️ Capacity: {event.capacity}</span>
                    </div>
                    <p style={{ lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        {event.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary-color)' }}>${event.price}</span>
                        <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }} onClick={handleBookEvent} disabled={authLoading}>
                            {authLoading ? 'Checking Login...' : 'Proceed to Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;
