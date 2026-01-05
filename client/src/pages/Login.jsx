import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/login', { email, password });
            navigate('/dashboard');
        } catch (err) {
            alert('Login Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '420px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: '30px',
                    fontSize: '28px',
                    fontWeight: '600'
                }}>Welcome Back</h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '14px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4a5568'}
                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '14px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4a5568'}
                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '14px',
                            background: '#4a5568',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '10px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2d3748'}
                        onMouseOut={(e) => e.target.style.background = '#4a5568'}
                    >
                        Login
                    </button>
                </form>
                <p style={{ marginTop: '24px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;