import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, FileText, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';

const mockBookings = [
  {
    id: 'BK-2024-101',
    type: 'Wedding Photography',
    requestedDate: '2024-04-15',
    scheduledDate: '2024-04-15 14:00',
    status: 'confirmed',
    photographer: 'Amaya Silva',
    package: 'Wedding Premium Package'
  },
  {
    id: 'BK-2024-089',
    type: 'Birthday Party',
    requestedDate: '2024-03-28',
    scheduledDate: null,
    status: 'pending',
    photographer: null,
    package: 'Birthday Basic Package'
  },
  {
    id: 'BK-2024-075',
    type: 'Corporate Event',
    requestedDate: '2024-02-10',
    scheduledDate: '2024-02-10 15:00',
    status: 'completed',
    photographer: 'Kasun Fernando',
    package: 'Corporate Package'
  },
  {
    id: 'REQ-2024-045',
    type: 'Outdoor Photoshoot',
    requestedDate: '2024-05-05',
    scheduledDate: null,
    status: 'request_pending',
    photographer: null,
    package: null
  }
];

export default function ClientBookings() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'client') {
      navigate('/client/login');
    }
  }, [navigate]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-900/50 text-green-400 border border-green-700">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-blue-900/50 text-blue-400 border border-blue-700">Pending</Badge>;
      case 'request_pending':
        return <Badge className="bg-yellow-900/50 text-yellow-400 border border-yellow-700">Request Pending</Badge>;
      case 'completed':
        return <Badge className="bg-gray-800 text-gray-300 border border-gray-700">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-900/50 text-red-400 border border-red-700">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-800 text-gray-400 border border-gray-700">{status}</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/client/dashboard">
          <Button variant="outline" className="mb-6 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
              <p className="text-gray-400">View all your photography bookings and requests</p>
            </div>
            <Link to="/client/book">
              <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                <Plus className="size-4 mr-2" />
                New Booking Request
              </Button>
            </Link>
          </div>
          
          <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 overflow-hidden shadow-xl">
            {/* Table Header */}
            <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-yellow-500 uppercase">
                <div className="col-span-2">Booking ID</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Requested Date</div>
                <div className="col-span-2">Scheduled Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Action</div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-800">
              {mockBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-4 hover:bg-gray-900/30 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <span className="text-gray-400 font-mono text-sm">{booking.id}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white font-medium">{booking.type}</span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="size-4" />
                        <span>{booking.requestedDate}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {booking.scheduledDate ? (
                        <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                          <Clock className="size-4" />
                          <span>{booking.scheduledDate}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">Not scheduled</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="col-span-2">
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                        <FileText className="size-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  {/* Additional Info (collapsed) */}
                  {booking.package && (
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-400">Package:</span> {booking.package}
                      {booking.photographer && (
                        <span className="ml-4"><span className="font-medium text-gray-400">Photographer:</span> {booking.photographer}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
          
          {/* Empty State (if no bookings) */}
          {mockBookings.length === 0 && (
            <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-12 text-center shadow-xl">
              <FileText className="size-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
              <p className="text-gray-400 mb-6">Start by requesting your first booking</p>
              <Link to="/client/book">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                  <Plus className="size-4 mr-2" />
                  Request a Booking
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
