import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../hooks/useWishlist';

export default function Wishlist() {
  const { products } = useProducts();
  const { items } = useWishlist();
  const wishlistedProducts = products.filter(p => items.includes(p.id));

  return (
    <>
      <Helmet>
        <title>Wishlist - JAA FOODS</title>
      </Helmet>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading text-brand-dark">My Wishlist</h1>
            <p className="text-gray-500 mt-2">{wishlistedProducts.length} item{wishlistedProducts.length !== 1 ? 's' : ''} saved</p>
          </motion.div>

          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💝</div>
              <h2 className="text-xl font-bold font-heading text-gray-800">Your wishlist is empty</h2>
              <p className="text-gray-500 mt-2">Browse our products and add your favourites!</p>
              <Link to="/products" className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-6 py-3 rounded-xl font-semibold mt-6 inline-block hover:shadow-lg transition-all">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
