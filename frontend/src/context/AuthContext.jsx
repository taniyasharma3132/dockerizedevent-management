import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { getApiErrorMessage } from '../api';
import { AuthContext } from './auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const saveSession = useCallback((authData) => {
        localStorage.setItem('token', authData.token);
        setToken(authData.token);
        setUser(authData.user);
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });
            saveSession(res.data);
            return res.data.user;
        } catch (err) {
            throw new Error(getApiErrorMessage(err, 'Login failed'), { cause: err });
        }
    }, [saveSession]);

    const register = useCallback(async (name, email, password, role) => {
        try {
            const res = await api.post('/api/auth/register', { name, email, password, role });
            saveSession(res.data);
            return res.data.user;
        } catch (err) {
            throw new Error(getApiErrorMessage(err, 'Registration failed'), { cause: err });
        }
    }, [saveSession]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const res = await api.get('/api/auth/me');
                if (!cancelled) setUser(res.data.user);
            } catch {
                if (!cancelled) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const value = useMemo(() => ({
        user,
        token,
        login,
        register,
        logout,
        loading
    }), [user, token, login, register, logout, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
