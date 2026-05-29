import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import { editableEventCategories, getEventCategoryLabel } from '../eventCategories';

function AdminEvents() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: 'tech', capacity: '', price: '', imageUrl: ''
    });
    const [editingId, setEditingId] = useState(null);

    const fetchEvents = useCallback(async () => {
        try {
            const res = await api.get('/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchEvents();
    }, [user, navigate, fetchEvents]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/events/${editingId}`, formData);
                alert('Event updated!');
            } else {
                await api.post('/api/events', formData);
                alert('Event created!');
            }
            setFormData({ title: '', description: '', date: '', location: '', category: 'tech', capacity: '', price: '', imageUrl: '' });
            setEditingId(null);
            fetchEvents();
        } catch (err) {
            console.error(err);
            alert('Error saving event');
        }
    };

    const handleEdit = (event) => {
        setEditingId(event._id);
        setFormData({
            title: event.title,
            description: event.description,
            date: new Date(event.date).toISOString().split('T')[0],
            location: event.location,
            category: event.category || 'other',
            capacity: event.capacity,
            price: event.price,
            imageUrl: event.imageUrl || ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/api/events/${id}`);
            alert('Event deleted!');
            fetchEvents();
        } catch (err) {
            console.error(err);
            alert('Error deleting event');
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1>Admin: Manage Events</h1>
            
            <div className="form-container" style={{ margin: '2rem 0', maxWidth: '600px', marginLeft: '0' }}>
                <h3 className="form-title">{editingId ? 'Edit Event' : 'Create New Event'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Date</label>
                            <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Location</label>
                            <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            {editableEventCategories.map((category) => (
                                <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Capacity</label>
                            <input type="number" required value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Price ($)</label>
                            <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {editingId ? 'Update Event' : 'Create Event'}
                        </button>
                        {editingId && (
                            <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', date: '', location: '', category: 'tech', capacity: '', price: '', imageUrl: '' }); }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2>Existing Events</h2>
            <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Title</th>
                        <th style={{ padding: '1rem' }}>Category</th>
                        <th style={{ padding: '1rem' }}>Date</th>
                        <th style={{ padding: '1rem' }}>Capacity</th>
                        <th style={{ padding: '1rem' }}>Price</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem' }}>{event.title}</td>
                            <td style={{ padding: '1rem' }}>{getEventCategoryLabel(event.category)}</td>
                            <td style={{ padding: '1rem' }}>{new Date(event.date).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem' }}>{event.capacity}</td>
                            <td style={{ padding: '1rem' }}>${event.price}</td>
                            <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleEdit(event)}>Edit</button>
                                <button className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--danger-color)', color: 'white' }} onClick={() => handleDelete(event._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminEvents;
