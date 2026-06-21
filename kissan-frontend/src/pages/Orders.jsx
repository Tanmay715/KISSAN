import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

function Orders() {
  const { user, is_authenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [is_loading, setIsLoading] = useState(true);

  useEffect(() => {
    if (is_authenticated && user?.role === 'buyer') {
      api.getMyOrders()
        .then(setOrders)
        .finally(() => setIsLoading(false));
    }
  }, [is_authenticated, user]);

  if (!is_authenticated || user?.role !== 'buyer') {
    return (
      <div className="container page empty-state">
        <h3>Login as a buyer to view orders</h3>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login</Link>
      </div>
    );
  }

  if (is_loading) {
    return <div className="loading container">Loading orders...</div>;
  }

  return (
    <div className="container page">
      <h1 className="page-title">My Orders</h1>
      <p className="page-subtitle">Track your crop purchases</p>

      {orders.length === 0 ? (
        <div className="empty-state card">
          <h3>No orders yet</h3>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <span className={`badge badge-${order.status}`} style={{ marginLeft: '0.75rem' }}>{order.status}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>₹{Number(order.total_amount).toFixed(2)}</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <ProductImage
                    product={{ name: item.product_name, image_url: item.image_url }}
                    size={48}
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <span>{item.product_name} — {item.quantity_kg} kg</span>
                  <strong style={{ marginLeft: 'auto' }}>₹{Number(item.subtotal).toFixed(2)}</strong>
                </div>
              ))}
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                Deliver to: {order.shipping_address}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
