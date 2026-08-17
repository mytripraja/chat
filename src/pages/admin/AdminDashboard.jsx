import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { listenToUsers } from '../../lib/firestore';

export default function AdminDashboard() {
  const { adminData } = useAuth();
  const { products } = useProducts();
  const { orders } = useOrders();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = listenToUsers(setUsers);
    return unsub;
  }, []);

  const stats = [
    { label: 'Products', value: products.length, icon: FiPackage, color: 'from-blue-500 to-blue-600' },
    { label: 'Orders', value: orders.length, icon: FiShoppingBag, color: 'from-brand-orange to-brand-red' },
    { label: 'Revenue', value: `₹${orders.reduce((s, o) => s + (o.total || 0), 0)}`, icon: FiDollarSign, color: 'from-green-500 to-green-600' },
    { label: 'Users', value: users.length, icon: FiUsers, color: 'from-purple-500 to-purple-600' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <>
      <Helmet><title>Admin Dashboard - JAA FOODS</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-800">Welcome back, {adminData?.name || 'Admin'}</h1>
          <p className="text-gray-500 text-sm">Here's what's happening with your store</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-md p-5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-xl font-bold text-gray-800">{s.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold font-heading text-gray-800 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-3 font-medium text-brand-orange">{o.orderId}</td>
                      <td className="py-3">{o.customerName}</td>
                      <td className="py-3">{o.productName}</td>
                      <td className="py-3 font-medium">₹{o.total}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
