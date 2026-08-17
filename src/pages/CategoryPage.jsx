import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import Loader from '../components/ui/Loader';

export default function CategoryPage({ categoryId, title, description, metaDesc }) {
  const { byCategory, loading } = useProducts();
  const products = byCategory(categoryId);

  return (
    <>
      <Helmet>
        <title>{title} - JAA FOODS</title>
        <meta name="description" content={metaDesc} />
      </Helmet>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-brand-orange">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-brand-orange">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-dark font-medium">{title}</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-heading text-brand-dark">{title}</h1>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">{description}</p>
          </motion.div>

          {loading ? <Loader /> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
