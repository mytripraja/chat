import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-orange/10 via-white to-brand-red/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-sm font-medium text-brand-orange">Fresh & Hygienic</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-heading text-brand-dark leading-tight">
              JAA<span className="text-gradient"> FOODS</span>
            </h1>

            <h2 className="text-xl sm:text-2xl text-gray-600 mt-4 font-medium">
              Refreshing Moments. Delicious Flavours.
            </h2>

            <p className="text-gray-500 mt-4 max-w-lg leading-relaxed">
              Quality refreshments made for every moment. From refreshing tube ice to delicious juice bottles, we bring taste and value to everyday moments.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/products"
                className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Explore Products <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/distributor"
                className="border-2 border-brand-orange text-brand-orange px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-orange hover:text-white transition-all"
              >
                Become a Distributor
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              {['Fresh', 'Hygienic', 'Affordable', 'Refreshing'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</span>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-red/20 rounded-3xl rotate-6 scale-95" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4">
                <div className="text-8xl">🧊</div>
                <h3 className="text-2xl font-bold font-heading text-brand-dark">Tube Ice & Juice Bottles</h3>
                <p className="text-gray-500 text-center text-sm">Multiple flavours for every taste</p>
                <div className="flex gap-2 mt-2">
                  {['🍊', '🥭', '🍇', '🍍', '🍋'].map((e, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                      className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl"
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
