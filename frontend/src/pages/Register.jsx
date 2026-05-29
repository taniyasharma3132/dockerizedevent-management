import { useState } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Registration failed');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">Create an Account</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            required 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            required 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Account Type</label>
                        <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="user">User</option>
                            <option value="admin">Event Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary form-submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
