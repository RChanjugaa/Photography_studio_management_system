import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, User, LogOut, Calendar } from 'lucide-react';
import { Button } from './ui/button';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      const role = localStorage.getItem('userRole');
      setIsAuthenticated(auth);
      setUserRole(role);
    };
    
    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setShowUserMenu(false);
    window.location.href = '/';
  };
  
  const userName = localStorage.getItem('userName') || 'User';
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/packages', label: 'Packages' },
    { path: '/employees', label: 'Our Team' },
    { path: '/cinematography', label: 'Cinematography' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];
  
  return (
    <nav className="bg-black sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-serif text-white">
              <span className="text-red-600">Ambiance</span>Photography
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-yellow-500 transition-colors uppercase tracking-wider text-sm">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-yellow-500 transition-colors uppercase tracking-wider text-sm">
              About
            </Link>
            <Link to="/packages" className="text-white hover:text-yellow-500 transition-colors uppercase tracking-wider text-sm">
              Packages
            </Link>
            <Link to="/employees" className="text-white hover:text-yellow-500 transition-colors uppercase tracking-wider text-sm">
              Our Team
            </Link>
            <Link to="/cinematography" className="text-white hover:text-yellow-500 transition-colors uppercase tracking-wider text-sm">
              Cinematography
            </Link>
            <Link to="/blog" className="text-white hover:text-yellow-500 transition-colors uppercase tracking-wider text-sm">
              Blog
            </Link>
            <Link to="/contact" className="text-white hover:text-yellow-500 transition-colors uppercase tracking-wider text-sm">
              Contact
            </Link>
          </div>
          
          {/* Book Now Button / User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center">
                    <User className="size-4 text-white" />
                  </div>
                  <span className="text-white text-sm">{userName.split(' ')[0]}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2">
                    <Link
                      to="/client/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <Calendar className="size-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/client/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <User className="size-4" />
                      <span>My Profile</span>
                    </Link>
                    <div className="border-t border-gray-800 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-800 transition-colors w-full text-left"
                    >
                      <LogOut className="size-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/client/login">
                <Button className="bg-red-700 hover:bg-red-800 text-white uppercase tracking-wider font-semibold px-8">
                  Book Now
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-black">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium uppercase tracking-wider ${
                  isActive(path)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3">
              <Link to="/client/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full bg-red-700 hover:bg-red-800 uppercase tracking-wider">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}