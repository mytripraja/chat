import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiChevronLeft, FiLogOut, FiHome, FiPackage, FiShoppingBag, FiCreditCard, FiUsers, FiFileText, FiSettings, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { to: '/admin', icon: FiHome, label: 'Dashboard', roles: ['admin', 'super_admin', 'ultra_admin', 'viewer'] },
  { to: '/admin/products', icon: FiPackage, label: 'Products', roles: ['admin', 'super_admin', 'ultra_admin'] },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders', roles: ['admin', 'super_admin', 'ultra_admin', 'viewer'] },
  { to: '/admin/payments', icon: FiCreditCard, label: 'Payments', roles: ['super_admin', 'ultra_admin'] },
  { to: '/admin/users', icon: FiUsers, label: 'Users', roles: ['ultra_admin'] },
  { to: '/admin/complaints', icon: FiMessageSquare, label: 'Complaints', roles: ['admin', 'super_admin', 'ultra_admin'] },
  { to: '/admin/audit', icon: FiFileText, label: 'Audit Log', roles: ['super_admin', 'ultra_admin'] },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings', roles: ['ultra_admin'] },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, adminData, logout, isAdmin, isUltraAdmin } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const allowed = menuItems.filter(m => {
    if (isUltraAdmin) return true;
    if (adminData?.role === 'super_admin') return m.roles.includes('super_admin');
    if (adminData?.role === 'admin') return m.roles.includes('admin');
    if (adminData?.role === 'viewer') return m.roles.includes('viewer');
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-dark transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="text-white font-bold font-heading text-sm">JAA Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-white lg:hidden">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
          {allowed.map(item => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-orange text-white'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-white/10 pt-3 mt-3">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <FiHome className="w-4 h-4" />
              View Website
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <FiMenu className="w-5 h-5" />
          </button>
          <Link to="/admin" className="flex items-center gap-2 lg:hidden">
            <FiChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{adminData?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
