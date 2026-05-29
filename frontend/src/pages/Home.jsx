import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { EVENT_CATEGORIES, getEventCategoryLabel } from '../eventCategories';

function Home() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const buildFilters = useCallback((category = selectedCategory) => ({
        search,
        location,
        ...(category !== 'all' ? { category } : {})
    }), [search, location, selectedCategory]);

    const fetchEvents = useCallback(async (filters) => {
        try {
            const res = await api.get('/api/events', { params: filters });
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchEvents({ search: '', location: '' });
    }, [fetchEvents]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents(buildFilters());
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        fetchEvents(buildFilters(category));
    };

    return (
        <div className="container">
            <div className="hero">
                <h1>Discover Amazing Events</h1>
                <p>Book tickets to the best experiences happening near you. Live concerts, conferences, and more.</p>
                <div className="search-container">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search events..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Location..." 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                </div>
                <div className="category-tabs" aria-label="Event categories">
                    {EVENT_CATEGORIES.map((category) => (
                        <button
                            key={category.value}
                            type="button"
                            className={`category-chip ${selectedCategory === category.value ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category.value)}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            <h2>Featured Events</h2>
            <div className="event-grid">
                {events.length === 0 ? <p>No events found.</p> : events.map(event => (
                    <div key={event._id} className="event-card">
                        {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="event-image" />}
                        <div className="event-content">
                            <span className="event-category">{getEventCategoryLabel(event.category)}</span>
                            <h3 className="event-title">{event.title}</h3>
                            <div className="event-meta">
                                📅 {new Date(event.date).toLocaleDateString()} <br/>
                                📍 {event.location} <br/>
                                🎟️ Capacity: {event.capacity}
                            </div>
                            <div className="event-footer">
                                <span className="event-price">${event.price}</span>
                                <Link to={`/event/${event._id}`} className="btn btn-secondary">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
