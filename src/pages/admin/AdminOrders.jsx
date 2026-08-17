import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiPrinter, FiCheck, FiX, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateOrderStatus, deleteOrder, getAllOrders } from '../../lib/firestore';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search || 
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone?.includes(search) ||
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.productName?.toLowerCase().includes(search.toLowerCase()) ||
      o.flavour?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    let matchDate = true;
    if (dateFilter && o.createdAt) {
      const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      const filter = new Date(dateFilter);
      matchDate = orderDate.toDateString() === filter.toDateString();
    }
    return matchSearch && matchStatus && matchDate;
  });

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(o => o.id));
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order marked as ${status}`);
      loadOrders();
    } catch {
      toast.error('Failed to update');
    }
    setUpdatingId(null);
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      toast.success('Order deleted');
      loadOrders();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const printLabel = (order) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Order Label</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; font-size: 14px; }
        .label { border: 2px solid #000; padding: 15px; max-width: 400px; margin: 0 auto; }
        .brand { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 10px; }
        .row { display: flex; justify-content: space-between; margin: 4px 0; }
        .label-sm { color: #666; }
      </style></head><body>
      <div class="label">
        <div class="brand">JAA FOODS</div>
        <div class="row"><span class="label-sm">Order ID:</span><strong>${order.orderId}</strong></div>
        <div class="row"><span class="label-sm">Customer:</span><span>${order.customerName}</span></div>
        <div class="row"><span class="label-sm">Phone:</span><span>${order.customerPhone}</span></div>
        <div class="row"><span class="label-sm">Address:</span><span>${order.address}, ${order.city} ${order.pincode || ''}</span></div>
        <hr style="margin: 8px 0;">
        <div class="row"><span class="label-sm">Product:</span><span>${order.productName} (${order.flavour})</span></div>
        <div class="row"><span class="label-sm">Size/Qty:</span><span>${order.size} x ${order.quantity}</span></div>
        <div class="row"><span class="label-sm">Total:</span><strong>₹${order.total}</strong></div>
        <div class="row"><span class="label-sm">Payment:</span><span>${order.paymentMethod?.toUpperCase()}</span></div>
      </div>
      <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
    win.document.close();
  };

  const printSelectedLabels = () => {
    const selectedOrders = orders.filter(o => selected.includes(o.id));
    if (selectedOrders.length === 0) return toast.error('Select orders first');
    const win = window.open('', '_blank');
    const labels = selectedOrders.map(o => `
      <div class="label" style="page-break-after: always;">
        <div class="brand">JAA FOODS</div>
        <div class="row"><span class="label-sm">Order ID:</span><strong>${o.orderId}</strong></div>
        <div class="row"><span class="label-sm">Customer:</span><span>${o.customerName}</span></div>
        <div class="row"><span class="label-sm">Phone:</span><span>${o.customerPhone}</span></div>
        <div class="row"><span class="label-sm">Address:</span><span>${o.address}, ${o.city} ${o.pincode || ''}</span></div>
        <hr style="margin: 8px 0;">
        <div class="row"><span class="label-sm">Product:</span><span>${o.productName} (${o.flavour})</span></div>
        <div class="row"><span class="label-sm">Size/Qty:</span><span>${o.size} x ${o.quantity}</span></div>
        <div class="row"><span class="label-sm">Total:</span><strong>₹${o.total}</strong></div>
        <div class="row"><span class="label-sm">Payment:</span><span>${o.paymentMethod?.toUpperCase()}</span></div>
      </div>
    `).join('');
    win.document.write(`
      <html><head><title>Order Labels</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 10px; font-size: 13px; }
        .label { border: 2px solid #000; padding: 15px; max-width: 350px; margin: 0 auto 20px; }
        .brand { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 8px; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; }
        .label-sm { color: #666; font-size: 12px; }
      </style></head><body>${labels}
      <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
    win.document.close();
  };

  const generateBill = (order) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Bill - ${order.orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; font-size: 13px; max-width: 500px; margin: 0 auto; }
        h2 { text-align: center; margin-bottom: 5px; }
        .sub { text-align: center; color: #666; font-size: 11px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f5f5f5; font-size: 12px; }
        .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 10px; }
        .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #999; }
      </style></head><body>
        <h2>JAA FOODS</h2>
        <p class="sub">FSSAI Lic. No: 22426582000213 | Customer Care: 9360940229</p>
        <hr>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Date:</strong> ${order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>Address:</strong> ${order.address}, ${order.city} ${order.pincode || ''}</p>
        <table>
          <tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          <tr><td>${order.productName} (${order.flavour})</td><td>${order.size}</td><td>${order.quantity}</td><td>₹${order.unitPrice}</td><td>₹${order.subtotal}</td></tr>
        </table>
        <p>Subtotal: ₹${order.subtotal}</p>
        <p>Shipping: ${order.shipping === 0 ? 'FREE' : '₹' + order.shipping}</p>
        <p class="total">Grand Total: ₹${order.total}</p>
        <p>Payment: ${order.paymentMethod?.toUpperCase()}</p>
        <p class="footer">Thank you for your order! | JAA FOODS - Refreshing Moments. Delicious Flavours.</p>
        <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
    win.document.close();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <Helmet><title>Manage Orders - JAA FOODS Admin</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm">{filtered.length} of {orders.length} orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, phone, order ID, item..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange">
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange" />
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-xl">
              <span className="text-sm font-medium text-brand-orange">{selected.length} selected</span>
              <button onClick={printSelectedLabels} className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-orange/80">
                <FiPrinter className="w-3 h-3" /> Print Labels
              </button>
              <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={selectAll} className="rounded" />
                    </th>
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggleSelect(o.id)} className="rounded" />
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-orange">{o.orderId}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{o.customerName}</p>
                        <p className="text-xs text-gray-500">{o.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{o.productName}</p>
                        <p className="text-xs text-gray-500">{o.flavour} - {o.size}</p>
                      </td>
                      <td className="px-4 py-3">{o.quantity}</td>
                      <td className="px-4 py-3 font-medium">₹{o.total}</td>
                      <td className="px-4 py-3 capitalize text-xs">{o.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={e => handleStatusUpdate(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none cursor-pointer ${getStatusColor(o.status)}`}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          <button onClick={() => setViewOrder(o)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500" title="View"><FiEye className="w-4 h-4" /></button>
                          <button onClick={() => generateBill(o)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500" title="Bill"><FiPrinter className="w-4 h-4" /></button>
                          <button onClick={() => printLabel(o)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500" title="Label"><FiPrinter className="w-3 h-3" /></button>
                          <button onClick={() => handleDeleteOrder(o.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><FiX className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {viewOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-heading">Order Details</h2>
                <button onClick={() => setViewOrder(null)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-bold text-brand-orange">{viewOrder.orderId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(viewOrder.status)}`}>{viewOrder.status}</span></div>
                <hr />
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span>{viewOrder.customerName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{viewOrder.customerPhone}</span></div>
                {viewOrder.customerEmail && <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{viewOrder.customerEmail}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="text-right">{viewOrder.address}, {viewOrder.city} {viewOrder.pincode || ''}</span></div>
                <hr />
                <div className="flex justify-between"><span className="text-gray-500">Product</span><span>{viewOrder.productName} ({viewOrder.flavour})</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Size</span><span>{viewOrder.size}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span>{viewOrder.quantity}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Unit Price</span><span>₹{viewOrder.unitPrice}</span></div>
                <hr />
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{viewOrder.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{viewOrder.shipping === 0 ? 'FREE' : `₹${viewOrder.shipping}`}</span></div>
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-brand-red">₹{viewOrder.total}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="capitalize">{viewOrder.paymentMethod}</span></div>
                {viewOrder.note && <div className="bg-orange-50 p-3 rounded-xl"><span className="text-gray-500 text-xs">Note:</span><p className="text-sm">{viewOrder.note}</p></div>}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { generateBill(viewOrder); }} className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-1"><FiPrinter className="w-4 h-4" /> Bill</button>
                <button onClick={() => { printLabel(viewOrder); }} className="flex-1 bg-brand-orange text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-orange/80 transition-all flex items-center justify-center gap-1"><FiPrinter className="w-4 h-4" /> Label</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
