import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <>
      <Helmet><title>Terms & Conditions - JAA FOODS</title></Helmet>
      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <h1 className="text-3xl font-bold font-heading text-brand-dark mb-6">Terms & Conditions</h1>
            <div className="prose prose-gray max-w-none space-y-4 text-sm text-gray-600 leading-relaxed">
              <p><strong>Last updated:</strong> January 2026</p>
              <p>By using the JAA FOODS website and placing orders, you agree to the following terms and conditions.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Products & Pricing</h2>
              <p>All product descriptions, images, and prices are subject to change without notice. We make every effort to display accurate information, but errors may occur.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Orders</h2>
              <p>Orders are subject to availability and confirmation. We reserve the right to cancel or refuse any order for any reason.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Payment</h2>
              <p>We accept Cash on Delivery, UPI, Bank Transfer, and Razorpay (online payments). Payment must be completed as per the selected method.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Delivery</h2>
              <p>Delivery times are estimates and may vary. JAA FOODS is not responsible for delays caused by factors beyond our control.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Returns & Refunds</h2>
              <p>Due to the nature of our products, returns may be limited. Please contact us within 24 hours of delivery for any concerns.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Intellectual Property</h2>
              <p>All content on this website, including logos, images, text, and design, is the property of JAA FOODS and protected by applicable laws.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Limitation of Liability</h2>
              <p>JAA FOODS shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Governing Law</h2>
              <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Tamil Nadu.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Contact</h2>
              <p>For questions, contact us at <strong>9360940229</strong>.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
