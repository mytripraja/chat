import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) { navigate('/admin'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Admin Login - JAA FOODS</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-brand-orange/10 to-brand-red/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white text-2xl font-bold font-heading mb-4">J</div>
              <h1 className="text-2xl font-bold font-heading text-brand-dark">JAA FOODS Admin</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to manage your store</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
