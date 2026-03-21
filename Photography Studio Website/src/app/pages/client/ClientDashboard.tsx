import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { User, Calendar, Clock, FileText, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'motion/react';

// Mock recent bookings
const recentBookings = [
  {
    id: 'BK-2024-101',
    type: 'Wedding Photography',
    date: '2024-04-15',
    status: 'confirmed',
    time: '2:00 PM'
  },
  {
    id: 'BK-2024-089',
    type: 'Birthday Party',
    date: '2024-03-28',
    status: 'pending',
    time: '10:00 AM'
  },
  {
    id: 'BK-2024-075',
    type: 'Corporate Event',
    date: '2024-02-10',
    status: 'completed',
    time: '3:00 PM'
  }
];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Guest';
  const firstName = userName.split(' ')[0];
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'client') {
      toast.error('Please log in to access the client portal');
      navigate('/client/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully');
    navigate('/client/login');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2a0f0f] to-black shadow-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-500">Ambiance Studio</h1>
                <p className="text-sm text-gray-400">Client Portal</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {firstName}!</h1>
          <p className="text-lg text-gray-400">Manage your bookings and profile from your dashboard</p>
        </motion.div>
        
        {/* Quick Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/client/profile">
              <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all cursor-pointer p-6 h-full shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <User className="size-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">My Profile</h3>
                  <p className="text-gray-400 text-sm">Update your personal information and preferences</p>
                </div>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/client/book">
              <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all cursor-pointer p-6 h-full shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Calendar className="size-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Request a Booking</h3>
                  <p className="text-gray-400 text-sm">Submit a new booking request for our services</p>
                </div>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/client/bookings">
              <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all cursor-pointer p-6 h-full shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <FileText className="size-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Booking History</h3>
                  <p className="text-gray-400 text-sm">View all your past and upcoming bookings</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
        
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
            <Link to="/client/bookings">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          
          <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 overflow-hidden shadow-xl">
            <div className="divide-y divide-gray-800">
              {recentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-6 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{booking.type}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="size-4" />
                          <span>{booking.id}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/client/bookings`}>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}