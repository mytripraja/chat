import { useState, useEffect } from 'react';

export function useWishlist() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jaa_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jaa_wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (productId) => {
    setItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId) => items.includes(productId);

  return { items, toggle, isWishlisted };
}
