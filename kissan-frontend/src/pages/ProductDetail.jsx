import { useEffect, useState } from 'react';
import ProductImage from '../components/ProductImage';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [is_loading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.getProduct(id)
      .then(setProduct)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  if (is_loading) {
    return <div className="loading container">Loading...</div>;
  }

  if (!product) {
    return <div className="empty-state container">Product not found</div>;
  }

  return (
    <div className="container page">
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' }}>
        <ProductImage
          product={product}
          size={600}
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
        />

        <div>
          <span className="badge" style={{ background: 'var(--green-100)', color: 'var(--green-800)', marginBottom: '1rem' }}>
            {product.category_name}
          </span>
          <h1 className="page-title">{product.name}</h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Sold by <strong>{product.farmer_name}</strong> · {product.location}
          </p>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>{product.description}</p>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--green-700)' }}>
              ₹{Number(product.price_per_kg).toFixed(2)}
            </span>
            <span style={{ color: 'var(--gray-500)' }}> /kg</span>
          </div>

          <p style={{ marginBottom: '1.5rem', color: 'var(--gray-700)' }}>
            Available: <strong>{Number(product.quantity_kg).toFixed(0)} kg</strong>
          </p>

          {user?.role === 'buyer' && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="form-group" style={{ marginBottom: 0, width: '120px' }}>
                <label>Quantity (kg)</label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity_kg}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={handleAddToCart} style={{ marginTop: '1.5rem' }}>
                Add to Cart
              </button>
            </div>
          )}

          {user?.role === 'farmer' && (
            <p className="alert alert-success">You are logged in as a farmer. Switch to a buyer account to purchase.</p>
          )}

          {!user && (
            <p className="alert alert-error">Please login as a buyer to add items to cart.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
