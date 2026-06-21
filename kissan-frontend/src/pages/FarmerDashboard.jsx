import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  name: '', description: '', price_per_kg: '', quantity_kg: '',
  category_id: '', location: '', image_url: '',
};

function FarmerDashboard() {
  const { user, is_authenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [active_tab, setActiveTab] = useState('products');
  const [is_loading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [product_list, order_list, category_list] = await Promise.all([
        api.getMyProducts(),
        api.getFarmerOrders(),
        api.getCategories(),
      ]);
      setProducts(product_list);
      setOrders(order_list);
      setCategories(category_list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (is_authenticated && user?.role === 'farmer') {
      loadData();
    }
  }, [is_authenticated, user]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.createProduct({
        ...form,
        price_per_kg: Number(form.price_per_kg),
        quantity_kg: Number(form.quantity_kg),
        category_id: Number(form.category_id),
      });
      setForm(EMPTY_FORM);
      setMessage('Product listed successfully!');
      loadData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    loadData();
  };

  const handleStatusUpdate = async (order_id, status) => {
    await api.updateOrderStatus(order_id, status);
    loadData();
  };

  if (!is_authenticated || user?.role !== 'farmer') {
    return (
      <div className="container page empty-state">
        <h3>Farmer access only</h3>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login as Farmer</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">My Farm Dashboard</h1>
      <p className="page-subtitle">Manage your crop listings and incoming orders</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          type="button"
          className={`btn btn-sm ${active_tab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          My Products ({products.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${active_tab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${active_tab === 'add' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('add')}
        >
          Add Product
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {is_loading ? (
        <div className="loading">Loading...</div>
      ) : active_tab === 'add' ? (
        <form className="card" style={{ padding: '2rem', maxWidth: 600 }} onSubmit={handleCreate}>
          <div className="form-group">
            <label>Product Name</label>
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category_id} onChange={(e) => updateField('category_id', e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows="3" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Price per kg (₹)</label>
              <input type="number" step="0.01" value={form.price_per_kg} onChange={(e) => updateField('price_per_kg', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Quantity (kg)</label>
              <input type="number" value={form.quantity_kg} onChange={(e) => updateField('quantity_kg', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={(e) => updateField('location', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input value={form.image_url} onChange={(e) => updateField('image_url', e.target.value)} placeholder="https://..." />
          </div>
          <button type="submit" className="btn btn-primary">List Product</button>
        </form>
      ) : active_tab === 'products' ? (
        products.length === 0 ? (
          <div className="empty-state card"><h3>No products yet</h3><p>Add your first crop listing</p></div>
        ) : (
          <div className="grid grid-3">
            {products.map((product) => (
              <div key={product.id} className="card" style={{ padding: '1.25rem' }}>
                <ProductImage
                  product={product}
                  style={{ height: 140, width: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}
                />
                <h3>{product.name}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{product.category_name}</p>
                <p style={{ fontWeight: 700, color: 'var(--green-700)' }}>₹{product.price_per_kg}/kg · {product.quantity_kg} kg left</p>
                <button type="button" className="btn btn-sm btn-danger" style={{ marginTop: '0.75rem' }} onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )
      ) : orders.length === 0 ? (
        <div className="empty-state card"><h3>No orders yet</h3></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <span className={`badge badge-${order.status}`} style={{ marginLeft: '0.75rem' }}>{order.status}</span>
                </div>
                <strong>₹{Number(order.total_amount).toFixed(2)}</strong>
              </div>
              {order.items.map((item) => (
                <p key={item.id} style={{ color: 'var(--gray-700)' }}>
                  {item.product_name} — {item.quantity_kg} kg @ ₹{item.price_per_kg}
                </p>
              ))}
              {order.status === 'pending' && (
                <button type="button" className="btn btn-sm btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => handleStatusUpdate(order.id, 'confirmed')}>
                  Confirm Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FarmerDashboard;
