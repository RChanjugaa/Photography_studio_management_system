import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export default function ClientBookingHistory() {
  const navigate = useNavigate();
  
  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      toast.error('Please login to view your bookings');
      navigate('/client/login');
    }
  }, [navigate]);
  
  const mockBookings = [
    {
      id: 'BK-1205',
      type: 'Wedding',
      requestedDate: '2026-03-15',
      actualDate: '2026-03-16',
      status: 'Confirmed',
    },
    {
      id: 'BK-1189',
      type: 'Studio Portrait',
      requestedDate: '2026-02-28',
      actualDate: null,
      status: 'Pending',
    },
    {
      id: 'BK-1156',
      type: 'Event',
      requestedDate: '2026-01-15',
      actualDate: '2026-01-15',
      status: 'Completed',
    },
    {
      id: 'REQ-892',
      type: 'Outdoor Session',
      requestedDate: '2026-04-10',
      actualDate: null,
      status: 'RequestPending',
    },
  ];
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Confirmed: { className: 'bg-green-100 text-green-700', label: 'Confirmed' },
      Pending: { className: 'bg-blue-100 text-blue-700', label: 'Pending' },
      Completed: { className: 'bg-gray-100 text-gray-700', label: 'Completed' },
      RequestPending: { className: 'bg-yellow-100 text-yellow-700', label: 'Request Pending' },
      Cancelled: { className: 'bg-red-100 text-red-700', label: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };
  
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/client/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#4C8BF5] mb-6">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Booking History</h1>
          <p className="text-gray-600">View all your booking requests and confirmed bookings</p>
        </div>
        
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Actual Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.type}</TableCell>
                    <TableCell>
                      {new Date(booking.requestedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {booking.actualDate
                        ? new Date(booking.actualDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="size-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {mockBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="size-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No bookings yet</p>
              <Link to="/client/book">
                <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">Request Your First Booking</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
