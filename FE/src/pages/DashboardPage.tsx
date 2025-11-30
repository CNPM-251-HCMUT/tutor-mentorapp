import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [msg, setMsg] = useState('Loading...');

    useEffect(() => {
        // Gọi API xuống Flask
        fetch('http://localhost:5000/api/hello')
            .then(res => res.json())
            .then(data => setMsg(data.message))
            .catch(() => setMsg('Error connecting to Backend'));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>Server says: <strong>{msg}</strong></p>
        </div>
    );
}