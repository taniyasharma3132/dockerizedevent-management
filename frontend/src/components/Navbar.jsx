import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">EventHub</Link>
                <div className="nav-links">
                    <Link to="/">Events</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <button onClick={logout} className="btn btn-secondary">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
