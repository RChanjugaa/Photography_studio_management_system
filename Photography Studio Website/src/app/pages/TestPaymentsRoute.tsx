import { Link } from 'react-router';

export default function TestPaymentsRoute() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl text-yellow-500 mb-8">Payment Routes Test</h1>
      
      <div className="space-y-4 max-w-2xl">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl text-yellow-500 mb-4">Quick Login</h2>
          <p className="text-gray-400 mb-4">Set admin authentication and navigate to payments:</p>
          
          <button
            onClick={() => {
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('userRole', 'admin');
              localStorage.setItem('userName', 'Admin User');
              localStorage.setItem('userEmail', 'admin@ambiance.lk');
              window.location.href = '/admin/payments';
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Login as Admin & Go to Payments
          </button>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl text-yellow-500 mb-4">Direct Links</h2>
          <div className="space-y-3">
            <Link
              to="/admin/login"
              className="block bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-center"
            >
              Go to Admin Login
            </Link>
            <Link
              to="/admin/dashboard"
              className="block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-center"
            >
              Go to Admin Dashboard
            </Link>
            <Link
              to="/admin/payments"
              className="block bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-center"
            >
              Go to Admin Payments (Direct)
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl text-yellow-500 mb-4">Current State</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>
              <span className="text-gray-400">Current URL:</span>{' '}
              <span className="text-white">{window.location.pathname}</span>
            </div>
            <div>
              <span className="text-gray-400">Authenticated:</span>{' '}
              <span className="text-white">{localStorage.getItem('isAuthenticated') || 'false'}</span>
            </div>
            <div>
              <span className="text-gray-400">User Role:</span>{' '}
              <span className="text-white">{localStorage.getItem('userRole') || 'none'}</span>
            </div>
            <div>
              <span className="text-gray-400">User Name:</span>{' '}
              <span className="text-white">{localStorage.getItem('userName') || 'none'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
