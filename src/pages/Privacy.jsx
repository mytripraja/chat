import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <>
      <Helmet><title>Privacy Policy - JAA FOODS</title></Helmet>
      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <h1 className="text-3xl font-bold font-heading text-brand-dark mb-6">Privacy Policy</h1>
            <div className="prose prose-gray max-w-none space-y-4 text-sm text-gray-600 leading-relaxed">
              <p><strong>Last updated:</strong> January 2026</p>
              <p>JAA FOODS ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Information We Collect</h2>
              <p>We may collect personal information including your name, email address, phone number, delivery address, and payment-related information when you place an order or contact us.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">How We Use Your Information</h2>
              <p>We use your information to process orders, communicate order updates, respond to enquiries, and improve our services.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Data Protection</h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Third-Party Services</h2>
              <p>We may use third-party services (such as payment processors and delivery partners) that have their own privacy policies. We encourage you to review their policies.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Cookies</h2>
              <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>

              <h2 className="text-lg font-semibold font-heading text-brand-dark pt-4">Contact Us</h2>
              <p>For any questions about this Privacy Policy, please contact us at <strong>9360940229</strong>.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
