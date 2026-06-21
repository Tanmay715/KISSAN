import { useState } from 'react';
import { getProductImageUrl } from '../utils/product_images';

function ProductImage({ product, className, style, size = 400 }) {
  const fallback_src = getProductImageUrl({ ...product, image_url: null }, size);
  const [src, setSrc] = useState(getProductImageUrl(product, size));

  const handleError = () => {
    if (src !== fallback_src) {
      setSrc(fallback_src);
    }
  };

  return (
    <img
      src={src}
      alt={product?.name || 'Product'}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
    />
  );
}

export default ProductImage;
