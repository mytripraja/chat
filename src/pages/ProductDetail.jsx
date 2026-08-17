import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import Loader from '../components/ui/Loader';
import { CATEGORIES } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, getProduct, loading } = useProducts();
  const product = getProduct(id);

  if (loading) return <Loader />;
  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold font-heading text-gray-800">Product not found</h2>
        <Link to="/products" className="text-brand-orange mt-4 inline-block hover:underline">Back to Products</Link>
      </div>
    </div>
  );

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const cat = CATEGORIES.find(c => c.id === product.category);

  return (
    <>
      <Helmet>
        <title>{product.name} - JAA FOODS</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} - JAA FOODS`} />
        <meta property="og:description" content={product.description} />
      </Helmet>

      <section className="py-12 lg:py-20 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-brand-orange">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-brand-orange">Products</Link>
            <span>/</span>
            <Link to={`/products/${product.category}`} className="hover:text-brand-orange">{cat?.label}</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-80 lg:h-[480px] object-cover" />
              ) : (
                <div className="w-full h-80 lg:h-[480px] flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
                  <span className="text-8xl">{product.category === 'water-tube-ice' ? '🧊' : product.category === 'milk-tube-ice' ? '🥛' : '🧃'}</span>
                </div>
              )}
              {product.videoUrl && (
                <div className="p-4">
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-64 rounded-xl"
                    allowFullScreen
                    title={`${product.name} video`}
                  />
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <p className="text-brand-orange font-medium text-sm">{product.categoryLabel}</p>
                <h1 className="text-3xl lg:text-4xl font-bold font-heading text-brand-dark mt-1">{product.name}</h1>
                <p className="text-gray-500 mt-3 leading-relaxed">{product.description}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                <h3 className="font-semibold font-heading text-brand-dark text-lg">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-orange-50">
                    <p className="text-gray-500">Flavour</p>
                    <p className="font-semibold text-gray-800">{product.flavour}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-50">
                    <p className="text-gray-500">Best Before</p>
                    <p className="font-semibold text-gray-800">{product.bestBefore}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-50">
                    <p className="text-gray-500">Availability</p>
                    <p className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-semibold font-heading text-brand-dark text-lg mb-3">Sizes & Price</h3>
                <div className="space-y-2">
                  {product.sizes?.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50">
                      <span className="font-medium text-gray-700">{s.label}</span>
                      <span className="text-xl font-bold text-brand-red">₹{s.mrp}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/order?product=${product.id}`}
                  className="block mt-4 text-center bg-gradient-to-r from-brand-orange to-brand-red text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Order Now
                </Link>
              </div>

              {product.ingredients && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="font-semibold font-heading text-brand-dark text-lg mb-2">Ingredients</h3>
                  <p className="text-sm text-gray-600">{product.ingredients}</p>
                </div>
              )}

              {product.storage && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="font-semibold font-heading text-brand-dark text-lg mb-2">Storage</h3>
                  <p className="text-sm text-gray-600">{product.storage}</p>
                </div>
              )}
            </motion.div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold font-heading text-brand-dark mb-8">Related Products</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
