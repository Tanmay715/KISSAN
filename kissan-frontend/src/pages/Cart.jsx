import { useState } from 'react';
import ProductImage from '../components/ProductImage';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Cart() {
  const { items, total_amount, updateQuantity, removeItem, clearCart } = useCart();
  const { user, is_authenticated } = useAuth();
  const [shipping_address, setShippingAddress] = useState(user?.address || '');
  const [is_submitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!shipping_address.trim()) {
      setError('Please enter a shipping address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.createOrder({
        shipping_address,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity_kg: item.quantity_kg,
        })),
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!is_authenticated || user?.role !== 'buyer') {
    return (
      <div className="container page empty-state">
        <h3>Login as a buyer to view your cart</h3>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container page empty-state">
        <h3>Your cart is empty</h3>
        <p>Browse fresh crops from local farmers</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Your Cart</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          {items.map((item) => (
            <div
              key={item.product_id}
              style={{
                display: 'flex', gap: '1rem', padding: '1rem 0',
                borderBottom: '1px solid var(--gray-200)', alignItems: 'center',
              }}
            >
              <ProductImage
                product={item}
                size={100}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--green-700)', fontWeight: 600 }}>₹{item.price_per_kg}/kg</p>
              </div>
              <input
                type="number"
                min="1"
                max={item.max_quantity}
                value={item.quantity_kg}
                onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
                style={{ width: 70, padding: '0.5rem', border: '2px solid var(--gray-200)', borderRadius: 'var(--radius-sm)' }}
              />
              <strong>₹{(item.price_per_kg * item.quantity_kg).toFixed(2)}</strong>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(item.product_id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Subtotal</span>
            <strong>₹{total_amount.toFixed(2)}</strong>
          </div>

          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              rows="3"
              value={shipping_address}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter delivery address"
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={is_submitting}
          >
            {is_submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
