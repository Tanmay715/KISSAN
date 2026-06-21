const CATEGORY_IMAGES = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
  pulses: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
  vegetables: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
  fruits: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
  spices: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
};

const DEFAULT_IMAGE = CATEGORY_IMAGES.fruits;

export function getProductImageUrl(product, size = 400) {
  if (product?.image_url?.trim()) {
    return product.image_url;
  }

  const slug = product?.category_slug
    || product?.category_name?.toLowerCase?.();

  const base_url = CATEGORY_IMAGES[slug] || DEFAULT_IMAGE;
  return base_url.replace('w=400', `w=${size}`);
}
