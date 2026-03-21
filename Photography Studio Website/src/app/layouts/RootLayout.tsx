import { Outlet, useLocation } from 'react-router';
import Navigation from '../components/Navigation';

export default function RootLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Hide navigation on admin, client dashboard, and staff pages
  const hideNavigation = location.pathname.startsWith('/admin') || 
                         location.pathname.startsWith('/client/dashboard') ||
                         location.pathname.startsWith('/client/profile') ||
                         location.pathname.startsWith('/client/book') ||
                         location.pathname.startsWith('/staff/');
  
  return (
    <div className="min-h-screen bg-white">
      {!hideNavigation && <Navigation />}
      <main className={isHomePage ? '' : ''}>
        <Outlet />
      </main>
    </div>
  );
}