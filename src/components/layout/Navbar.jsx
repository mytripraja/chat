import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiHeart, FiChevronDown } from 'react-icons/fi';
import { FaPhoneAlt } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products', children: [
    { to: '/products/water-tube-ice', label: 'Water Tube Ice' },
    { to: '/products/milk-tube-ice', label: 'Milk Tube Ice' },
    { to: '/products/juice-bottle', label: 'Juice Bottle' },
  ]},
  { to: '/distributor', label: 'Distributor' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(null);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center">
              <span className="text-white font-bold text-lg font-heading">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading text-brand-dark leading-tight">JAA FOODS</h1>
              <p className="text-[10px] text-gray-500 leading-tight hidden sm:block">Refreshing Moments</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div
                key={link.to}
                className="relative"
                onMouseEnter={() => link.children && setDropdown(link.to)}
                onMouseLeave={() => setDropdown(null)}
              >
                <Link
                  to={link.to}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-brand-orange bg-orange-50'
                      : 'text-gray-700 hover:text-brand-orange hover:bg-orange-50'
                  }`}
                >
                  {link.label}
                  {link.children && <FiChevronDown className="w-3 h-3" />}
                </Link>
                {link.children && dropdown === link.to && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border py-2 min-w-[200px] z-50">
                    {link.children.map(child => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/wishlist" className="p-2 rounded-lg text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors">
              <FiHeart className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/919360940229"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <FaPhoneAlt className="w-5 h-5" />
            </a>
            <Link
              to="/order"
              className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
            >
              Order Now
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <div key={link.to}>
                <Link
                  to={link.to}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.to
                      ? 'text-brand-orange bg-orange-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="pl-4">
                    {link.children.map(child => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-orange"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex flex-col gap-2">
              <Link
                to="/wishlist"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FiHeart className="w-4 h-4" /> Wishlist
              </Link>
              <Link
                to="/order"
                className="bg-gradient-to-r from-brand-orange to-brand-red text-white text-center px-5 py-3 rounded-xl font-semibold"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
