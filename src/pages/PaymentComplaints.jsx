import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function PaymentComplaints() {
  const [form, setForm] = useState({ name: '', phone: '', orderId: '', paymentMethod: '', amount: '', issue: '', screenshot: null });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.issue) return toast.error('Please fill required fields');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'payment_complaints'), {
        name: form.name,
        phone: form.phone,
        orderId: form.orderId,
        paymentMethod: form.paymentMethod,
        amount: form.amount,
        issue: form.issue,
        status: 'open',
        createdAt: new Date(),
      });
      toast.success('Complaint submitted! We will review within 24 hours.');
      setForm({ name: '', phone: '', orderId: '', paymentMethod: '', amount: '', issue: '', screenshot: null });
    } catch {
      toast.error('Failed to submit. Please call 9360940229.');
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet><title>Payment Complaints - JAA FOODS</title></Helmet>
      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-brand-dark">Payment Issue?</h1>
            <p className="text-gray-500 mt-2">We will help you resolve it within 24 hours</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input name="orderId" value={form.orderId} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" placeholder="JAA..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange">
                  <option value="">Select</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
                <input name="amount" type="number" value={form.amount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your Issue *</label>
              <textarea name="issue" value={form.issue} onChange={handleChange} rows={4} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none" placeholder="Tell us what happened with your payment..." />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Or call us directly at <a href="tel:+919360940229" className="text-brand-orange font-medium">9360940229</a>
            </p>
          </motion.form>
        </div>
      </section>
    </>
  );
}
