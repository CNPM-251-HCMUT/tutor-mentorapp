// FE/src/pages/auth/LoginPage.tsx
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {authApi} from '../services/api';


export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Gọi API /me
        const res = await authApi.me();
        
        if (res && res.user) {
          console.log("Cookie còn hạn, tự động chuyển trang...");
          // Điều hướng dựa trên Role (Logic đơn giản)
          if (res.user.role === 'Student') navigate('/student/dashboard');
          else if (res.user.role === 'Tutor') navigate('/tutor/dashboard');
          else if (res.user.role === 'Staff') navigate('/staff/dashboard');
          else if (res.user.role === 'Administrator') navigate('/admin/dashboard');
          else navigate('/dashboard'); // Mặc định
        }
      } catch (err) {
        // Không làm gì, để user nhập login
        console.log("Chưa đăng nhập hoặc cookie hết hạn.");
      } finally {
        setChecking(false); // Dừng màn hình loading
      }
    };

    checkLogin();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(username, password);

      if (!res.user || res.error) {
        throw new Error(res.error || 'Login failed');
      }

      // Login thành công -> Điều hướng
      if (res.user.role === 'Student') navigate('/student/dashboard');
      else if (res.user.role === 'Tutor') navigate('/tutor/dashboard');
      else if (res.user.role === 'Staff') navigate('/staff/dashboard');
      else if (res.user.role === 'Administrator') navigate('/admin/dashboard');
      else navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        Checking session...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '100%',
        margin: '60px auto',
        padding: 24,
        border: '1px solid #ddd',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <h1 style={{ marginBottom: 16 }}>Login</h1>
      <p style={{ fontSize: 14, marginBottom: 16 }}>
        Demo accounts (từ BE):<br />
        <code>student1 / 123</code><br />
        <code>tutor1 / 123</code><br />
        <code>staff1 / 123</code><br />
        <code>admin1 / 123</code>
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
