import { useState, useEffect } from 'react';
import { getAllProducts } from '../lib/firestore';
import { DEFAULT_PRODUCTS } from '../data/products';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(data => {
        if (data.length > 0) {
          setProducts(data);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts(DEFAULT_PRODUCTS);
        setLoading(false);
      });
  }, []);

  const byCategory = (cat) => products.filter(p => p.category === cat);
  const featured = products.filter(p => p.featured);
  const getProduct = (id) => products.find(p => p.id === id);

  return { products, loading, byCategory, featured, getProduct };
}
