import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <ProductImage product={product} className="product-image" />
        <span className="product-category">{product.category_name}</span>
      </Link>

      <div className="product-body">
        <Link to={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-farmer">By {product.farmer_name}</p>
        <div className="product-footer">
          <div>
            <span className="product-price">₹{Number(product.price_per_kg).toFixed(2)}</span>
            <span className="product-unit">/kg</span>
          </div>
          {onAddToCart && (
            <button type="button" className="btn btn-sm btn-primary" onClick={() => onAddToCart(product)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
