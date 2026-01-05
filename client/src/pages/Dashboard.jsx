import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({ email: '', role: '' });
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch tasks: " + err.message);
            setIsLoading(false);
            navigate('/login');
        }
    };

    const fetchUserInfo = async () => {
        try {
            const res = await api.get('/auth/me');
            setUserInfo({ email: res.data.email, role: res.data.role });
        } catch (err) {
            console.error("Failed to fetch user info" + err.message);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            navigate('/login');
        }
    };

    const addTask = async () => {
        if (!title) return;
        try {
            const res = await api.post('/tasks', { title, status: 'pending' });
            setTasks([...tasks, res.data]);
            setTitle('');
        } catch (err) {
            alert('Failed to add task: ' + (err.response?.data?.message || err.message));
        }
    };

    const deleteTask = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (err) {
            alert('Failed to delete task: ' + (err.response?.data?.message || err.message));
        }
    };

    const startEdit = (task) => {
        setEditingTask(task.id);
        setEditTitle(task.title);
        setEditStatus(task.status);
    };

    const cancelEdit = () => {
        setEditingTask(null);
        setEditTitle('');
        setEditStatus('');
    };

    const updateTask = async (id) => {
        if (!editTitle) return;
        try {
            const res = await api.put(`/tasks/${id}`, { title: editTitle, status: editStatus });
            setTasks(tasks.map(task => task.id === id ? res.data : task));
            cancelEdit();
        } catch (err) {
            alert('Failed to update task: ' + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#333',
                fontSize: '18px'
            }}>
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '8px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h1 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '28px', fontWeight: '600' }}>Dashboard</h1>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#666' }}>
                            <span><strong>Email:</strong> {userInfo.email}</span>
                            <span style={{
                                background: userInfo.role === 'admin' ? '#4a5568' : '#718096',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'inline-block',
                                width: 'fit-content'
                            }}>
                                {userInfo.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            padding: '10px 24px',
                            background: '#e53e3e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#c53030'}
                        onMouseOut={(e) => e.target.style.background = '#e53e3e'}
                    >
                        Logout
                    </button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

                <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter new task..."
                        style={{
                            flex: '1',
                            minWidth: '200px',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4a5568'}
                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    />
                    <button
                        onClick={addTask}
                        style={{
                            padding: '12px 30px',
                            background: '#4a5568',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'background 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2d3748'}
                        onMouseOut={(e) => e.target.style.background = '#4a5568'}
                    >
                        Add Task
                    </button>
                </div>

                <div style={{ marginTop: '30px' }}>
                    {tasks.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#a0aec0', padding: '40px 0' }}>No tasks yet. Add your first task above!</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {tasks.map(task => (
                                <li
                                    key={task.id}
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '15px',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    {editingTask === task.id ? (
                                        <>
                                            <div style={{ display: 'flex', gap: '10px', flex: '1', flexWrap: 'wrap' }}>
                                                <input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    style={{
                                                        padding: '8px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                        flex: '1',
                                                        minWidth: '150px'
                                                    }}
                                                />
                                                <select
                                                    value={editStatus}
                                                    onChange={(e) => setEditStatus(e.target.value)}
                                                    style={{
                                                        padding: '8px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                        backgroundColor: 'white',
                                                        color: '#333'
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => updateTask(task.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#48bb78',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#718096',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <strong style={{ color: '#333', flex: '1', minWidth: '150px' }}>{task.title}</strong>
                                            <span style={{
                                                background: task.status === 'pending' ? '#ecc94b' : '#48bb78',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {task.status}
                                            </span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => startEdit(task)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#4299e1',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#e53e3e',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;