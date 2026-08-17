import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return toast.error('Please fill required fields');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_messages'), { ...form, createdAt: new Date() });
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try WhatsApp.');
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact JAA FOODS - Customer Care</title>
        <meta name="description" content="Contact JAA FOODS for enquiries, orders, distributor opportunities. Call 9360940229 or WhatsApp us." />
      </Helmet>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-heading text-brand-dark">
              Contact <span className="text-gradient">JAA FOODS</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg">We would love to hear from you</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold font-heading text-brand-dark mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <a href="tel:+919360940229" className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <FaPhoneAlt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Care</p>
                      <p className="font-semibold text-gray-800">9360940229</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/919360940229"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <FaWhatsapp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-semibold text-gray-800">Chat with us</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-dark to-gray-900 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold font-heading mb-2">JAA FOODS</h3>
                <p className="text-gray-400 text-sm">Food & Beverage Manufacturing</p>
                <p className="text-gray-400 text-sm mt-1">Customer Care: 9360940229</p>
                <p className="text-gray-400 text-xs mt-4">FSSAI Licence No: 22426582000213</p>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 space-y-5"
            >
              <h2 className="text-xl font-bold font-heading text-brand-dark">Send a Message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
}
