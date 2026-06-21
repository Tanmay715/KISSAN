import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { user, is_authenticated, logout } = useAuth();
  const { item_count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌾</span>
          <span className="brand-text">KISSAN</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/mandi-prices">Mandi Prices</NavLink>
          {is_authenticated && user?.role === 'farmer' && (
            <NavLink to="/farmer/dashboard">My Farm</NavLink>
          )}
          {is_authenticated && user?.role === 'buyer' && (
            <NavLink to="/orders">My Orders</NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {is_authenticated && user?.role === 'buyer' && (
            <Link to="/cart" className="cart-btn">
              🛒 Cart
              {item_count > 0 && <span className="cart-badge">{Math.round(item_count)}</span>}
            </Link>
          )}

          {is_authenticated ? (
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button type="button" className="btn btn-sm btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
