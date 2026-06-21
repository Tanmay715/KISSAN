import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    api.getProducts({ limit: 6 }).then((data) => setProducts(data.products));
    api.getCategories().then(setCategories);
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <h1>Fresh from Farm to Your Doorstep</h1>
            <p>
              KISSAN connects farmers directly with buyers. Order wheat, pulses, rice,
              and fresh produce at fair prices — no middlemen.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">Browse Crops</Link>
              <Link to="/mandi-prices" className="btn btn-secondary">Check Mandi Prices</Link>
            </div>
          </div>
          <div className="hero-visual">🌾🫘🍚</div>
        </div>
      </section>

      <section className="container page">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container page">
        <div className="section-header">
          <h2 className="section-title">Featured Listings</h2>
          <Link to="/products" className="see-all">View all →</Link>
        </div>
        <div className="grid grid-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={user?.role === 'buyer' ? addItem : undefined}
            />
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Are you a farmer?</h2>
          <p>List your crops on KISSAN and reach buyers across India.</p>
          <Link to="/register" className="btn btn-primary">Start Selling</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
