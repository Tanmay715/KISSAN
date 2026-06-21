import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'buyer', phone: '', address: '',
  });
  const [error, setError] = useState('');
  const [is_loading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await register(form);
      navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 520 }}>
      <h1 className="page-title">Create Account</h1>
      <p className="page-subtitle">Join KISSAN as a farmer or buyer</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required minLength={6} />
        </div>
        <div className="form-group">
          <label>I am a</label>
          <select value={form.role} onChange={(e) => updateField('role', e.target.value)}>
            <option value="buyer">Buyer — I want to purchase crops</option>
            <option value="farmer">Farmer — I want to sell my crops</option>
          </select>
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea value={form.address} onChange={(e) => updateField('address', e.target.value)} rows="2" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={is_loading}>
          {is_loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray-500)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--green-700)', fontWeight: 600 }}>Login</Link>
      </p>
    </div>
  );
}

export default Register;
