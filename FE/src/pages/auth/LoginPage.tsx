import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Login</h1>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px' }}>
                Login (Demo)
            </button>
        </div>
    );
}