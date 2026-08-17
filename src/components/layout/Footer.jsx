import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaYoutube, FaInstagram, FaFacebook } from 'react-icons/fa';
import { DEFAULT_SETTINGS } from '../../data/settings';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/distributor', label: 'Distributor' },
  { to: '/contact', label: 'Contact' },
];

const productLinks = [
  { to: '/products/water-tube-ice', label: 'Water Based Tube Ice' },
  { to: '/products/milk-tube-ice', label: 'Milk Tube Ice' },
  { to: '/products/juice-bottle', label: 'Juice Bottle' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center">
                <span className="text-white font-bold text-lg font-heading">J</span>
              </div>
              <h3 className="text-xl font-bold font-heading">JAA FOODS</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{DEFAULT_SETTINGS.brand.tagline}</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Quality refreshments made for every moment. FSSAI Lic. No: {DEFAULT_SETTINGS.brand.fssai}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-heading mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 text-sm hover:text-brand-orange transition-colors">{l.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/admin" className="text-gray-400 text-sm hover:text-brand-orange transition-colors">Admin</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-heading mb-4">Products</h4>
            <ul className="space-y-2">
              {productLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 text-sm hover:text-brand-orange transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-heading mb-4">Customer Care</h4>
            <div className="space-y-3">
              <a href="tel:+919360940229" className="flex items-center gap-2 text-gray-400 text-sm hover:text-brand-orange transition-colors">
                <FaPhoneAlt className="w-4 h-4" /> {DEFAULT_SETTINGS.brand.phone}
              </a>
              <a
                href="https://wa.me/919360940229"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 text-sm hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"><FaYoutube className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors"><FaInstagram className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"><FaFacebook className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">FSSAI Licence No: {DEFAULT_SETTINGS.brand.fssai}</p>
          <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} JAA FOODS. All Rights Reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link to="/privacy" className="text-gray-500 hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-brand-orange transition-colors">Terms & Conditions</Link>
            <Link to="/payment-complaints" className="text-gray-500 hover:text-brand-orange transition-colors">Payment Issues</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
