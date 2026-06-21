import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [is_loading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 480 }}>
      <h1 className="page-title">Login</h1>
      <p className="page-subtitle">Welcome back to KISSAN</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={is_loading}>
          {is_loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray-500)' }}>
        Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--green-700)', fontWeight: 600 }}>Register</Link>
      </p>

      <div className="card" style={{ padding: '1rem', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
        <strong>Demo accounts:</strong><br />
        Farmer: farmer@kissan.com / password123<br />
        Buyer: buyer@kissan.com / password123
      </div>
    </div>
  );
}

export default Login;
