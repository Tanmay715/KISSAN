import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Products.css';

function Products() {
  const [search_params, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [is_loading, setIsLoading] = useState(true);
  const [search_input, setSearchInput] = useState(search_params.get('search') || '');
  const { user } = useAuth();
  const { addItem } = useCart();

  const search = search_params.get('search') || '';
  const category = search_params.get('category') || '';
  const page = search_params.get('page') || '1';

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setIsLoading(true);
    api.getProducts({ search, category_slug: category, page, limit: 12 })
      .then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => setIsLoading(false));
  }, [search, category, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(search_params);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', search_input.trim());
  };

  const handleCategoryClick = (slug) => {
    updateFilter('category', category === slug ? '' : slug);
  };

  return (
    <div className="container page">
      <div className="products-header">
        <h1 className="page-title">Shop Fresh Crops</h1>
        <p className="page-subtitle">Wheat, pulses, rice, vegetables and more — direct from farmers</p>
      </div>

      <div className="products-filters card">
        <form className="products-search-wrap" onSubmit={handleSearchSubmit}>
          <span className="products-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="products-search"
            placeholder="Search wheat, pulses, rice, vegetables..."
            value={search_input}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <span className="products-filter-label">Browse by category</span>
        <div className="products-categories">
          <button
            type="button"
            className={`products-category-btn ${!category ? 'active' : ''}`}
            onClick={() => handleCategoryClick('')}
          >
            All Crops
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`products-category-btn ${category === cat.slug ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              <span className="products-category-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {is_loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {!is_loading && pagination.total > 0 && (
            <div className="products-results-meta">
              <span>
                Showing {products.length} of {pagination.total} products
                {search && <> for &ldquo;{search}&rdquo;</>}
              </span>
            </div>
          )}

          <div className="grid grid-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={user?.role === 'buyer' ? addItem : undefined}
              />
            ))}
          </div>

          {pagination.total_pages > 1 && (
            <div className="products-pagination">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => updateFilter('page', String(Number(page) - 1))}
              >
                Previous
              </button>
              <span style={{ color: 'var(--gray-500)' }}>
                Page {pagination.page} of {pagination.total_pages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page >= pagination.total_pages}
                onClick={() => updateFilter('page', String(Number(page) + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
