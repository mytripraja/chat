import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function DistributorCTA() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-dark via-gray-900 to-brand-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading">Partner With JAA FOODS</h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-relaxed">
            Interested in stocking JAA FOODS products? Contact us for wholesale and distributor enquiries. Join our growing network of partners across Tamil Nadu.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/distributor"
              className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Become a Distributor <FiArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919360940229"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <FaWhatsapp className="w-5 h-5" /> WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
