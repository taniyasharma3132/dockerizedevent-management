import { useState } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Login failed');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">Welcome Back</h2>
                <form onSubmit={onSubmit}>
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
                    <button type="submit" className="btn btn-primary form-submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
