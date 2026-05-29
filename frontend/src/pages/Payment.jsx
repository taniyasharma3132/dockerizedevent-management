import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api';
import { useAuth } from '../context/auth';

const upiId = 'eventhub@upi';

function Payment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const qrCells = useMemo(() => Array.from({ length: 121 }, (_, index) => {
        const row = Math.floor(index / 11);
        const col = index % 11;
        const inTopLeft = row < 4 && col < 4;
        const inTopRight = row < 4 && col > 6;
        const inBottomLeft = row > 6 && col < 4;
        const pattern = (row * 3 + col * 5 + row * col) % 4 === 0;

        return inTopLeft || inTopRight || inBottomLeft || pattern;
    }), []);

    useEffect(() => {
        if (!authLoading && !user) {
            alert('Please login to continue payment.');
            navigate('/login');
        }
    }, [authLoading, user, navigate]);

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

    const handlePaymentDone = async () => {
        if (!event || submitting) return;

        setSubmitting(true);

        try {
            const transactionId = `UPI-${Date.now()}`;
            const res = await api.post('/api/bookings', {
                eventId: event._id,
                paymentMethod: 'upi',
                paymentStatus: 'paid',
                transactionId
            });

            navigate(`/booking-success/${res.data._id}`);
        } catch (err) {
            console.error(err);
            alert(getApiErrorMessage(err, 'Payment completed, but booking failed'));
            setSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading payment...</div>;
    }

    if (!event) {
        return <div className="container" style={{ marginTop: '2rem' }}>Event not found.</div>;
    }

    return (
        <div className="container">
            <div className="payment-layout">
                <section className="payment-panel">
                    <h1>UPI Payment</h1>
                    <p className="payment-muted">Scan the sample UPI QR code and complete payment to confirm your booking.</p>

                    <div className="qr-card" aria-label="Sample UPI scanner">
                        <div className="qr-grid">
                            {qrCells.map((filled, index) => (
                                <span key={index} className={filled ? 'filled' : ''} />
                            ))}
                        </div>
                        <div>
                            <strong>Sample Scanner</strong>
                            <span>UPI ID: {upiId}</span>
                        </div>
                    </div>

                    <div className="payment-actions">
                        <button type="button" className="btn btn-primary" onClick={handlePaymentDone} disabled={submitting}>
                            {submitting ? 'Confirming...' : 'Payment Done'}
                        </button>
                        <Link to={`/event/${event._id}`} className="btn btn-secondary">Back to Event</Link>
                    </div>
                </section>

                <aside className="payment-summary">
                    <h2>Booking Summary</h2>
                    <h3>{event.title}</h3>
                    <p>{new Date(event.date).toLocaleString()}</p>
                    <p>{event.location}</p>
                    <div className="payment-total">
                        <span>Total</span>
                        <strong>Rs. {event.price}</strong>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Payment;
