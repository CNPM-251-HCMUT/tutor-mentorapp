import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
            <Link to="/" style={{ marginRight: '15px' }}>Login</Link>
            <Link to="/dashboard">Dashboard</Link>
        </nav>
    );
}