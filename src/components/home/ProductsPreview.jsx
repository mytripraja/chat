import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../ui/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import Loader from '../ui/Loader';

export default function ProductsPreview() {
  const { featured, loading } = useProducts();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-orange-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading text-brand-dark">Our Products</h2>
          <p className="text-gray-500 mt-3">Refreshing range for every taste and occasion</p>
        </div>

        {loading ? <Loader /> : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-red text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                View All Products <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
