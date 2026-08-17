import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import Loader from '../components/ui/Loader';
import { CATEGORIES } from '../data/products';

export default function Products() {
  const { products, loading } = useProducts();

  return (
    <>
      <Helmet>
        <title>Products - JAA FOODS | Tube Ice, Milk Tube Ice, Juice Bottle</title>
        <meta name="description" content="Explore JAA FOODS products: Water Based Tube Ice, Milk Tube Ice and Juice Bottle in multiple refreshing flavours." />
      </Helmet>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-heading text-brand-dark">
              Our <span className="text-gradient">Products</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg">Refreshing range for every taste and occasion</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/products/${cat.id}`} className="block p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all text-center group">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="text-xl font-bold font-heading text-brand-dark">{cat.label}</h3>
                  <p className="text-sm text-gray-500 mt-2">{cat.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-bold font-heading text-brand-dark mb-8 text-center">All Products</h2>

          {loading ? <Loader /> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
