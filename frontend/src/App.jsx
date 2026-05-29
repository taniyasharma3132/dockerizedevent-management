import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';

import AdminEvents from './pages/AdminEvents';
import AdminRegistrations from './pages/AdminRegistrations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/payment/:id" element={<Payment />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/registrations" element={<AdminRegistrations />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
