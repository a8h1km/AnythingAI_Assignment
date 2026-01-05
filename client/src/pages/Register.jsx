import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password, role });
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration Failed');
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
                }}>Create Account</h1>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            padding: '14px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '15px',
                            backgroundColor: 'white',
                            color: '#333',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
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
                        Sign Up
                    </button>
                </form>
                <p style={{ marginTop: '24px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                    Already have an account? <Link to="/login" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '600' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;