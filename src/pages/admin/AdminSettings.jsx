import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../../lib/firestore';
import { DEFAULT_SETTINGS } from '../../data/settings';

export default function AdminSettings() {
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
      obj[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  return (
    <>
      <Helmet><title>Settings - JAA FOODS Admin</title></Helmet>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm">Manage site-wide settings, API keys, and integrations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">Brand Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
              <input name="brand.phone" value={settings.brand?.phone || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">FSSAI Number</label>
              <input name="brand.fssai" value={settings.brand?.fssai || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">WhatsApp API (Future)</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="whatsapp.enabled" checked={settings.whatsapp?.enabled} onChange={handleChange} className="w-5 h-5 rounded text-brand-orange" />
            <span className="font-medium text-sm">Enable WhatsApp API</span>
          </label>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp Phone Number</label>
            <input name="whatsapp.phoneNumber" value={settings.whatsapp?.phoneNumber || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" placeholder="919360940229" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp API Key (stored securely in Firebase)</label>
            <input type="password" name="whatsapp.apiKey" value={settings.whatsapp?.apiKey || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" placeholder="Paste API key here" />
            <p className="text-xs text-gray-400 mt-1">API key is stored in Firebase, not visible to users.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">Email API (Future)</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="email.enabled" checked={settings.email?.enabled} onChange={handleChange} className="w-5 h-5 rounded text-brand-orange" />
            <span className="font-medium text-sm">Enable Auto Email</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Service (e.g., emailjs)</label>
              <input name="email.service" value={settings.email?.service || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Service ID</label>
              <input name="email.serviceId" value={settings.email?.serviceId || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Template ID</label>
              <input name="email.templateId" value={settings.email?.templateId || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
              <input type="password" name="email.apiKey" value={settings.email?.apiKey || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-800 border-b pb-3">Social Media</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">YouTube URL</label>
              <input name="social.youtube" value={settings.social?.youtube || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instagram URL</label>
              <input name="social.instagram" value={settings.social?.instagram || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Facebook URL</label>
              <input name="social.facebook" value={settings.social?.facebook || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </>
  );
}
