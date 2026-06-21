import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, quantity_kg = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) => (
          item.product_id === product.id
            ? { ...item, quantity_kg: item.quantity_kg + quantity_kg }
            : item
        ));
      }

      return [...prev, {
        product_id: product.id,
        name: product.name,
        price_per_kg: Number(product.price_per_kg),
        image_url: product.image_url,
        category_slug: product.category_slug,
        category_name: product.category_name,
        quantity_kg,
        max_quantity: Number(product.quantity_kg),
      }];
    });
  };

  const updateQuantity = (product_id, quantity_kg) => {
    if (quantity_kg <= 0) {
      removeItem(product_id);
      return;
    }

    setItems((prev) => prev.map((item) => (
      item.product_id === product_id ? { ...item, quantity_kg } : item
    )));
  };

  const removeItem = (product_id) => {
    setItems((prev) => prev.filter((item) => item.product_id !== product_id));
  };

  const clearCart = () => setItems([]);

  const total_amount = items.reduce(
    (sum, item) => sum + item.price_per_kg * item.quantity_kg,
    0,
  );

  const item_count = items.reduce((sum, item) => sum + item.quantity_kg, 0);

  const value = useMemo(() => ({
    items,
    item_count,
    total_amount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }), [items, item_count, total_amount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
