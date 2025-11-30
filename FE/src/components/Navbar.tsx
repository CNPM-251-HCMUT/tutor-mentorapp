import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={styles.navBar}>
            <Link to="/" style={{ marginRight: '15px' }}>Login</Link>
            <Link to="/dashboard">Dashboard</Link>
        </nav>
    );
}

const styles = {
    navBar: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'row' as 'row',
        backgroundColor: '#f0f0f0',
    }
}