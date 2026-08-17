import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import Loader from './components/ui/Loader';

import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import { WaterTubeIce, MilkTubeIce, JuiceBottle } from './pages/CategoryPages';
import Distributor from './pages/Distributor';
import Contact from './pages/Contact';
import OrderPage from './pages/OrderPage';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import PaymentComplaints from './pages/PaymentComplaints';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAudit from './pages/admin/AdminAudit';
import AdminSettings from './pages/admin/AdminSettings';
import AdminComplaints from './pages/admin/AdminComplaints';

import WhatsAppButton from './components/ui/WhatsAppButton';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/admin/login" />;
  return children;
}

function AppContent() {
  const { settings } = useSettings();
  const phone = settings?.whatsapp?.phoneNumber || '919360940229';

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <WhatsAppButton phone={phone} />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/products/water-tube-ice" element={<Layout><WaterTubeIce /></Layout>} />
        <Route path="/products/milk-tube-ice" element={<Layout><MilkTubeIce /></Layout>} />
        <Route path="/products/juice-bottle" element={<Layout><JuiceBottle /></Layout>} />
        <Route path="/distributor" element={<Layout><Distributor /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/order" element={<Layout><OrderPage /></Layout>} />
        <Route path="/track" element={<Layout><OrderTracking /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/payment-complaints" element={<Layout><PaymentComplaints /></Layout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute><AdminLayout><AdminComplaints /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/audit" element={<ProtectedRoute><AdminLayout><AdminAudit /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
