import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../../hooks/useWishlist';
import { getCloudinaryThumbnail } from '../../lib/cloudinary';
import { FLAVOUR_COLORS } from '../../data/products';

export default function ProductCard({ product }) {
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const smallest = product.sizes?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <div
            className="h-48 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: FLAVOUR_COLORS[product.flavour] + '22' || '#FFF3E0' }}
          >
            {product.image ? (
              <img
                src={getCloudinaryThumbnail(product.image, 400)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                {product.category === 'water-tube-ice' ? '🧊' : product.category === 'milk-tube-ice' ? '🥛' : '🧃'}
              </div>
            )}
          </div>
        </Link>
        <button
          onClick={() => toggle(product.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          {wishlisted ? <FaHeart className="w-4 h-4 text-red-500" /> : <FiHeart className="w-4 h-4 text-gray-400" />}
        </button>
        {!product.inStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Out of Stock</div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <p className="text-xs text-brand-orange font-medium">{product.categoryLabel}</p>
          <h3 className="text-lg font-semibold text-gray-800 font-heading mt-1 group-hover:text-brand-orange transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.sizes?.map((s, i) => (
              <span key={i} className="text-sm text-gray-600">
                {s.label} - <span className="font-bold text-brand-red">₹{s.mrp}</span>
              </span>
            ))}
          </div>
          <Link
            to={`/order?product=${product.id}`}
            className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-4 py-2 rounded-xl text-xs font-semibold hover:shadow-lg transition-all"
          >
            Order
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
