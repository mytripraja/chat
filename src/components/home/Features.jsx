import { motion } from 'framer-motion';
import { FiRefreshCw, FiDollarSign, FiShield, FiSmile } from 'react-icons/fi';

const features = [
  { icon: FiRefreshCw, title: 'Refreshing Taste', desc: 'Cool and refreshing products for hot days.' },
  { icon: FiDollarSign, title: 'Affordable Pricing', desc: 'Quality products at prices everyone can enjoy.' },
  { icon: FiShield, title: 'Hygienic Production', desc: 'Made with care in clean and hygienic facilities.' },
  { icon: FiSmile, title: 'Multiple Flavours', desc: 'Wide range of flavours for the whole family.' },
];

export default function Features() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading text-brand-dark">Why Choose JAA FOODS?</h2>
          <p className="text-gray-500 mt-3">Quality you can trust, taste you will love</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-brand-dark">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
