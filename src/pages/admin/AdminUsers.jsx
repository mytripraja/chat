import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { saveAdminUser, getAllUsers } from '../../lib/firestore';
import { listenToUsers } from '../../lib/firestore';
import { useAuth } from '../../hooks/useAuth';

const ROLES = ['viewer', 'admin', 'super_admin', 'ultra_admin'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'viewer' });
  const [loading, setLoading] = useState(false);
  const { isUltraAdmin } = useAuth();

  useEffect(() => {
    const unsub = listenToUsers(setUsers);
    return unsub;
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isUltraAdmin) return toast.error('Only ultra admin can create users');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await saveAdminUser(cred.user.uid, { email: form.email, name: form.name, role: form.role });
      toast.success('User created!');
      setForm({ email: '', password: '', name: '', role: 'viewer' });
      setShowForm(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    }
    setLoading(false);
  };

  const handleRoleChange = async (uid, role) => {
    if (!isUltraAdmin) return;
    try {
      await saveAdminUser(uid, { role });
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  return (
    <>
      <Helmet><title>Manage Users - JAA FOODS Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-gray-800">Users</h1>
            <p className="text-gray-500 text-sm">{users.length} users</p>
          </div>
          {isUltraAdmin && (
            <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
              {showForm ? 'Cancel' : 'Create User'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="font-bold font-heading text-gray-800">New User</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="px-3 py-2.5 rounded-xl border text-sm" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="px-3 py-2.5 rounded-xl border text-sm" />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required className="px-3 py-2.5 rounded-xl border text-sm" />
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="px-3 py-2.5 rounded-xl border text-sm">
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      {isUltraAdmin ? (
                        <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="px-2 py-1 rounded-lg border text-xs">
                          {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                        </select>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 capitalize">{u.role?.replace('_', ' ')}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
