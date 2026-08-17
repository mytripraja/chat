import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { useProducts } from '../hooks/useProducts';
import { useSettings } from '../hooks/useSettings';
import { placeOrder } from '../lib/firestore';
import Loader from '../components/ui/Loader';

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('product');
  const { products, getProduct, loading: prodLoading } = useProducts();
  const { settings } = useSettings();

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', pincode: '',
    product: '', size: '', quantity: 1, paymentMethod: 'cod', note: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    if (preselected) {
      setForm(prev => ({ ...prev, product: preselected }));
    }
  }, [preselected]);

  const selectedProduct = getProduct(form.product);
  const selectedSize = selectedProduct?.sizes?.find(s => s.label === form.size);
  const subtotal = selectedSize ? selectedSize.mrp * form.quantity : 0;
  const shipping = subtotal >= (settings?.shipping?.freeShippingAbove || 500) ? 0 : (settings?.shipping?.defaultShipping || 50);
  const total = subtotal + shipping;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city || !form.product || !form.size) {
      return toast.error('Please fill all required fields');
    }
    setSubmitting(true);
    try {
      const orderData = {
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        productId: form.product,
        productName: selectedProduct?.name,
        productCategory: selectedProduct?.category,
        flavour: selectedProduct?.flavour,
        size: form.size,
        quantity: parseInt(form.quantity),
        unitPrice: selectedSize?.mrp,
        subtotal,
        shipping,
        total,
        paymentMethod: form.paymentMethod,
        note: form.note,
      };

      if (form.paymentMethod === 'cod') {
        if (!settings?.payment?.codEnabled) {
          toast.error('COD is currently disabled. Please choose another payment method.');
          setSubmitting(false);
          return;
        }
      }

      const orderId = await placeOrder(orderData);
      setOrderResult({ ...orderData, orderId });
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
    setSubmitting(false);
  };

  const getWhatsAppMessage = () => {
    if (!orderResult) return '';
    const msg = `🛒 *New Order - JAA FOODS*\n\n` +
      `Order ID: ${orderResult.orderId}\n` +
      `Customer: ${orderResult.customerName}\n` +
      `Phone: ${orderResult.customerPhone}\n` +
      `Address: ${orderResult.address}, ${orderResult.city} - ${orderResult.pincode}\n\n` +
      `*Item:* ${orderResult.productName} (${orderResult.flavour})\n` +
      `Size: ${orderResult.size} x ${orderResult.quantity}\n\n` +
      `Subtotal: ₹${orderResult.subtotal}\n` +
      `Shipping: ₹${orderResult.shipping}\n` +
      `*Total: ₹${orderResult.total}*\n\n` +
      `Payment: ${orderResult.paymentMethod.toUpperCase()}`;
    return encodeURIComponent(msg);
  };

  const getPaymentInstructions = () => {
    switch (form.paymentMethod) {
      case 'upi':
        return (
          <div className="p-4 bg-purple-50 rounded-xl mt-4 space-y-3">
            <h4 className="font-semibold text-purple-800">UPI Payment Details</h4>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">UPI ID</p>
              <p className="text-lg font-bold text-brand-dark">{settings?.payment?.upiId || 'jaafoods@upi'}</p>
            </div>
            {settings?.payment?.upiQrCode && (
              <div className="text-center">
                <img src={settings.payment.upiQrCode} alt="UPI QR Code" className="w-48 h-48 mx-auto rounded-lg" />
              </div>
            )}
            <p className="text-sm text-gray-600">After making payment, share the payment screenshot to <strong>9360940229</strong> with your Order ID for confirmation.</p>
            <p className="text-xs text-gray-500">Payment will be confirmed within 24 working hours (usually within 1 hour).</p>
          </div>
        );
      case 'bank':
        return (
          <div className="p-4 bg-blue-50 rounded-xl mt-4 space-y-3">
            <h4 className="font-semibold text-blue-800">Bank Transfer Details</h4>
            <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-medium">{settings?.payment?.bankName || 'State Bank of India'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Account Holder</span><span className="font-medium">{settings?.payment?.accountHolder || 'JAA FOODS'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Account No</span><span className="font-medium">{settings?.payment?.accountNumber || 'XXXXXXXXXXXX'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">IFSC</span><span className="font-medium">{settings?.payment?.ifscCode || 'SBIN0000000'}</span></div>
            </div>
            <p className="text-sm text-gray-600">After transferring, share the payment screenshot to <strong>9360940229</strong> with your Order ID.</p>
            <p className="text-xs text-gray-500">Payment will be confirmed within 24 working hours (usually within 1 hour).</p>
          </div>
        );
      case 'razorpay':
        return (
          <div className="p-4 bg-orange-50 rounded-xl mt-4 space-y-3">
            <h4 className="font-semibold text-orange-800">Razorpay Payment</h4>
            <p className="text-sm text-gray-600">Click "Pay with Razorpay" below to complete your payment securely.</p>
            {settings?.payment?.razorpayExtraChargePercent > 0 && (
              <p className="text-xs text-orange-600 font-medium">
                Note: A {settings.payment.razorpayExtraChargePercent}% extra charge applies for credit/debit card payments. This charge is collected by Razorpay, not by JAA FOODS.
              </p>
            )}
          </div>
        );
      default:
        return (
          <div className="p-4 bg-green-50 rounded-xl mt-4">
            <h4 className="font-semibold text-green-800">Cash on Delivery</h4>
            <p className="text-sm text-gray-600 mt-1">Pay when you receive your order. Please keep exact change ready.</p>
          </div>
        );
    }
  };

  if (prodLoading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Place Order - JAA FOODS</title>
        <meta name="description" content="Order JAA FOODS Tube Ice and Juice Bottles. Fresh, affordable and hygienic food and beverage products." />
      </Helmet>

      <section className="py-12 lg:py-20 bg-gradient-to-br from-brand-orange/5 to-white min-h-[80vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-brand-dark">Place Your Order</h1>
            <p className="text-gray-500 mt-2">Fill in the details below to order</p>
          </motion.div>

          {orderResult ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 text-center space-y-6">
              <div className="text-6xl">✅</div>
              <h2 className="text-2xl font-bold font-heading text-brand-dark">Order Placed Successfully!</h2>
              <p className="text-gray-500">Your Order ID: <span className="font-bold text-brand-orange">{orderResult.orderId}</span></p>
              <p className="text-sm text-gray-500">You can track your order status using this ID.</p>

              {orderResult.paymentMethod !== 'cod' && getPaymentInstructions()}

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a
                  href={`https://wa.me/919360940229?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" /> Send Order via WhatsApp
                </a>
                <button
                  onClick={() => { setOrderResult(null); setForm({ name: '', phone: '', email: '', address: '', city: '', pincode: '', product: '', size: '', quantity: 1, paymentMethod: 'cod', note: '' }); }}
                  className="border-2 border-brand-orange text-brand-orange px-6 py-3 rounded-xl font-semibold hover:bg-brand-orange hover:text-white transition-all"
                >
                  Place Another Order
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 space-y-6"
            >
              <h2 className="text-xl font-bold font-heading text-brand-dark border-b pb-3">Customer Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (for order updates)</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={2} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
              </div>

              <h2 className="text-xl font-bold font-heading text-brand-dark border-b pb-3 pt-4">Product Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                  <select name="product" value={form.product} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange">
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.categoryLabel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                  <select name="size" value={form.size} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange">
                    <option value="">Select Size</option>
                    {selectedProduct?.sizes?.map(s => (
                      <option key={s.label} value={s.label}>{s.label} - ₹{s.mrp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input name="quantity" type="number" min="1" max="100" value={form.quantity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
                </div>
              </div>

              {subtotal > 0 && (
                <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span className="text-brand-red">₹{total}</span></div>
                  {shipping > 0 && <p className="text-xs text-gray-500">Free shipping on orders above ₹{settings?.shipping?.freeShippingAbove || 500}</p>}
                </div>
              )}

              <h2 className="text-xl font-bold font-heading text-brand-dark border-b pb-3 pt-4">Payment Method</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', enabled: settings?.payment?.codEnabled !== false },
                  { id: 'upi', label: 'UPI', enabled: settings?.payment?.upiEnabled !== false },
                  { id: 'bank', label: 'Bank Transfer', enabled: settings?.payment?.bankEnabled !== false },
                  { id: 'razorpay', label: 'Razorpay', enabled: settings?.payment?.razorpayEnabled },
                ].filter(m => m.enabled).map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: method.id }))}
                    className={`p-3 rounded-xl border-2 text-sm font-medium text-center transition-all ${
                      form.paymentMethod === method.id
                        ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              {getPaymentInstructions()}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Note</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none" placeholder="Any special instructions..." />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
