import { Link, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Users, LogOut, Menu, X, Calendar, DollarSign, Image } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export default function AdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };
  
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/employees', label: 'Employees', icon: Users },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/payments', label: 'Payments', icon: DollarSign },
    { path: '/gallery', label: 'Galleries', icon: Image },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-gradient-to-r from-black to-[#1a0505] border-b-2 border-red-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="text-yellow-500 font-serif text-2xl uppercase tracking-wider">
              Ambiance Admin
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-red-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-700"></div>
            
            <div className="text-gray-400 text-sm">
              {localStorage.getItem('userName') || 'Admin'}
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-700 text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-red-700 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-gray-800 my-2"></div>
              
              <div className="px-4 py-2 text-gray-400 text-sm">
                {localStorage.getItem('userName') || 'Admin'}
              </div>
              
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                variant="outline"
                className="mx-4 border-red-700 text-red-400 hover:bg-red-900/20"
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}