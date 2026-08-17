import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FaWhatsapp } from 'react-icons/fa';

export default function Distributor() {
  const [form, setForm] = useState({ name: '', business: '', phone: '', city: '', product: '', quantity: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Please fill name and phone');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'distributor_enquiries'), { ...form, createdAt: new Date() });
      toast.success('Enquiry submitted! We will contact you soon.');
      setForm({ name: '', business: '', phone: '', city: '', product: '', quantity: '', message: '' });
    } catch {
      toast.error('Failed to submit. Please try WhatsApp.');
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Become a Distributor - JAA FOODS</title>
        <meta name="description" content="Partner with JAA FOODS as a distributor or wholesaler. Contact us for bulk orders and distributor enquiries." />
      </Helmet>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-heading text-brand-dark">
              Partner With <span className="text-gradient">JAA FOODS</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Interested in stocking JAA FOODS products? Contact us for wholesale and distributor enquiries.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a
              href="https://wa.me/919360940229?text=Hi%2C%20I%20am%20interested%20in%20becoming%20a%20JAA%20FOODS%20distributor."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <FaWhatsapp className="w-5 h-5" /> WhatsApp Us
            </a>
            <a href="tel:+919360940229" className="bg-brand-orange text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-orange/80 transition-all">
              Call: 9360940229
            </a>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 space-y-6"
          >
            <h2 className="text-2xl font-bold font-heading text-brand-dark text-center mb-4">Distributor Enquiry Form</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input name="business" value={form.business} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Interested In</label>
                <select name="product" value={form.product} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange">
                  <option value="">Select Product</option>
                  <option value="water-tube-ice">Water Based Tube Ice</option>
                  <option value="milk-tube-ice">Milk Tube Ice</option>
                  <option value="juice-bottle">Juice Bottle</option>
                  <option value="all">All Products</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Required</label>
                <input name="quantity" value={form.quantity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" placeholder="e.g., 500 pieces" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none" />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </motion.form>
        </div>
      </section>
    </>
  );
}
