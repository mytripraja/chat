import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../../lib/firestore';
import { DEFAULT_SETTINGS } from '../../data/settings';

export default function AdminPayments() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(data => {
      if (data) setSettings(prev => ({ ...prev, ...data }));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');
    setSettings(prev => {
      const updated = { ...prev };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value;
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Payment settings saved!');
    } catch {
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  return (
    <>
      <Helmet><title>Payment Settings - JAA FOODS Admin</title></Helmet>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-800">Payment Settings</h1>
          <p className="text-gray-500 text-sm">Configure payment methods and details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">Cash on Delivery</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="payment.codEnabled" checked={settings.payment?.codEnabled} onChange={handleChange} className="w-5 h-5 rounded text-brand-orange" />
            <span className="font-medium text-sm">Enable Cash on Delivery</span>
          </label>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">UPI Payment</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="payment.upiEnabled" checked={settings.payment?.upiEnabled} onChange={handleChange} className="w-5 h-5 rounded text-brand-orange" />
            <span className="font-medium text-sm">Enable UPI</span>
          </label>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">UPI ID</label>
            <input name="payment.upiId" value={settings.payment?.upiId || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">QR Code Image URL (optional)</label>
            <input name="payment.upiQrCode" value={settings.payment?.upiQrCode || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" placeholder="https://..." />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">Bank Transfer</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="payment.bankEnabled" checked={settings.payment?.bankEnabled} onChange={handleChange} className="w-5 h-5 rounded text-brand-orange" />
            <span className="font-medium text-sm">Enable Bank Transfer</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'payment.bankName', label: 'Bank Name' },
              { key: 'payment.accountHolder', label: 'Account Holder' },
              { key: 'payment.accountNumber', label: 'Account Number' },
              { key: 'payment.ifscCode', label: 'IFSC Code' },
              { key: 'payment.bankBranch', label: 'Branch' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                <input name={f.key} value={settings.payment?.[f.key.replace('payment.', '')] || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">Razorpay</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="payment.razorpayEnabled" checked={settings.payment?.razorpayEnabled} onChange={handleChange} className="w-5 h-5 rounded text-brand-orange" />
            <span className="font-medium text-sm">Enable Razorpay</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Razorpay Key ID</label>
              <input name="payment.razorpayKeyId" value={settings.payment?.razorpayKeyId || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Razorpay Key Secret</label>
              <input type="password" name="payment.razorpayKeySecret" value={settings.payment?.razorpayKeySecret || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Extra Charge % (for card payments)</label>
              <input type="number" name="payment.razorpayExtraChargePercent" value={settings.payment?.razorpayExtraChargePercent || 0} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">Shipping</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Free Shipping Above (₹)</label>
              <input type="number" name="shipping.freeShippingAbove" value={settings.shipping?.freeShippingAbove || 500} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Default Shipping Fee (₹)</label>
              <input type="number" name="shipping.defaultShipping" value={settings.shipping?.defaultShipping || 50} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </>
  );
}
