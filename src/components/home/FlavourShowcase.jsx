import { motion } from 'framer-motion';
import { FLAVOUR_COLORS } from '../../data/products';

const flavours = [
  { name: 'Orange', emoji: '🍊' },
  { name: 'Mango', emoji: '🥭' },
  { name: 'Grapes', emoji: '🍇' },
  { name: 'Pineapple', emoji: '🍍' },
  { name: 'Lemon', emoji: '🍋' },
  { name: 'Pista', emoji: '🥜' },
  { name: 'Rose Milk', emoji: '🌹' },
  { name: 'Chocolate', emoji: '🍫' },
];

export default function FlavourShowcase() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading text-brand-dark">Our Flavours</h2>
          <p className="text-gray-500 mt-3">A burst of taste in every bite</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {flavours.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="text-center cursor-pointer"
            >
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-md hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: (FLAVOUR_COLORS[f.name] || '#FF8C00') + '22' }}
              >
                {f.emoji}
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">{f.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
