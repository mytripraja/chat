import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { addProduct, updateProduct, deleteProduct, getAllProducts } from '../../lib/firestore';
import { uploadImage } from '../../lib/cloudinary';
import { CATEGORIES } from '../../data/products';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const emptyProduct = {
    name: '', category: 'water-tube-ice', flavour: '', description: '',
    ingredients: '', storage: '', bestBefore: '30 days',
    sizes: [{ label: '40 ml', mrp: 2 }], image: '', videoUrl: '', inStock: true, featured: false,
  };
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSizeChange = (index, field, value) => {
    const sizes = [...form.sizes];
    sizes[index] = { ...sizes[index], [field]: field === 'mrp' ? parseFloat(value) || 0 : value };
    setForm(prev => ({ ...prev, sizes }));
  };

  const addSize = () => setForm(prev => ({ ...prev, sizes: [...prev.sizes, { label: '', mrp: 0 }] }));
  const removeSize = (i) => setForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, idx) => idx !== i) }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.flavour) return toast.error('Name and flavour are required');
    try {
      if (editing) {
        await updateProduct(editing, form);
        toast.success('Product updated!');
      } else {
        await addProduct(form);
        toast.success('Product added!');
      }
      setForm(emptyProduct);
      setEditing(null);
      setShowForm(false);
      loadProducts();
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({ ...product });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getCategoryLabel = (catId) => CATEGORIES.find(c => c.id === catId)?.label || catId;

  return (
    <>
      <Helmet><title>Manage Products - JAA FOODS Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-gray-800">Products</h1>
            <p className="text-gray-500 text-sm">{products.length} products</p>
          </div>
          <button
            onClick={() => { setForm(emptyProduct); setEditing(null); setShowForm(true); }}
            className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold font-heading text-gray-800 mb-4">{editing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Flavour *</label>
                  <input name="flavour" value={form.flavour} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Best Before</label>
                  <input name="bestBefore" value={form.bestBefore} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange resize-none" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ingredients</label>
                  <input name="ingredients" value={form.ingredients} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Storage</label>
                  <input name="storage" value={form.storage} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-brand-orange" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sizes & Price</label>
                <div className="space-y-2">
                  {form.sizes.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={s.label} onChange={e => handleSizeChange(i, 'label', e.target.value)} placeholder="Size label" className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-brand-orange" />
                      <input type="number" value={s.mrp} onChange={e => handleSizeChange(i, 'mrp', e.target.value)} placeholder="MRP ₹" className="w-24 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-brand-orange" />
                      {form.sizes.length > 1 && <button type="button" onClick={() => removeSize(i)} className="text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addSize} className="text-brand-orange text-xs mt-2 hover:underline">+ Add Size</button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
                  {uploading && <p className="text-xs text-brand-orange mt-1">Uploading...</p>}
                  {form.image && <img src={form.image} alt="Preview" className="mt-2 w-20 h-20 rounded-lg object-cover" />}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1"><FiVideo className="w-3 h-3 inline" /> Video URL (YouTube/Instagram embed)</label>
                  <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-brand-orange" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} className="w-4 h-4 rounded text-brand-orange" />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded text-brand-orange" />
                  Featured
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                  {editing ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No products yet. Add your first product!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Flavour</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">📦</div>}
                          <span className="font-medium text-gray-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{getCategoryLabel(p.category)}</td>
                      <td className="px-4 py-3 text-gray-600">{p.flavour}</td>
                      <td className="px-4 py-3">
                        {p.sizes?.map((s, i) => <span key={i} className="block text-xs">{s.label}: ₹{s.mrp}</span>)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${p.inStock ? 'text-green-600' : 'text-red-500'}`}>{p.inStock ? 'In Stock' : 'Out'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><FiEdit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                        </div>
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
