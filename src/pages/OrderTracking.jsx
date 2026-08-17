import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getOrderById } from '../lib/firestore';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'shipped', label: 'Shipped', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '📦' },
];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const result = await getOrderById(orderId.trim().toUpperCase());
      if (result) {
        setOrder(result);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const currentIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1;

  return (
    <>
      <Helmet>
        <title>Track Your Order - JAA FOODS</title>
        <meta name="description" content="Track your JAA FOODS order status in real time." />
      </Helmet>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white min-h-[80vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-brand-dark">Track Your Order</h1>
            <p className="text-gray-500 mt-2">Enter your Order ID to check status</p>
          </motion.div>

          <form onSubmit={handleSearch} className="flex gap-3 mb-10">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., JAA1ABC123)"
              className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center mb-6">
              {error}
            </motion.div>
          )}

          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-bold text-brand-orange text-lg">{order.orderId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Product</span><span className="font-medium">{order.productName} ({order.flavour})</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-medium">{order.quantity} x {order.size}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-brand-red">₹{order.total}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold font-heading text-brand-dark mb-6">Order Progress</h3>
                <div className="space-y-1">
                  {STATUS_STEPS.map((step, i) => {
                    const active = i <= currentIndex;
                    const current = i === currentIndex;
                    return (
                      <div key={step.key} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all ${
                          active ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'
                        } ${current ? 'ring-4 ring-brand-orange/20' : ''}`}>
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${active ? 'text-brand-dark' : 'text-gray-400'}`}>{step.label}</p>
                        </div>
                        {active && <span className="text-xs text-green-600 font-medium">Done</span>}
                        {current && <span className="text-xs text-brand-orange font-medium">Current</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                For any queries, contact us at <a href="tel:+919360940229" className="text-brand-orange font-medium">9360940229</a>
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
