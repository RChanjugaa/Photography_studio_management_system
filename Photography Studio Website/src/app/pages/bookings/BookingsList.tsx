import { Plus, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function BookingsList() {
  const mockBookings = [
    {
      id: 'BK-1205',
      client: 'John & Sarah Johnson',
      package: 'Wedding Gold',
      date: '2026-03-16T14:00:00',
      photographer: 'Sarah Williams',
      status: 'Confirmed',
    },
    {
      id: 'BK-1189',
      client: 'Tech Corp Inc.',
      package: 'Corporate Event',
      date: '2026-02-28T09:00:00',
      photographer: 'Mike Chen',
      status: 'Pending',
    },
    {
      id: 'BK-1156',
      client: 'Emma Rodriguez',
      package: 'Studio Portrait',
      date: '2026-01-15T11:00:00',
      photographer: 'David Park',
      status: 'Completed',
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Bookings Management</h1>
            <p className="text-gray-600">Manage all booking requests and confirmations</p>
          </div>
          <div className="flex gap-3">
            <Link to="/calendar">
              <Button variant="outline">
                <Calendar className="size-4 mr-2" />
                Calendar View
              </Button>
            </Link>
            <Link to="/bookings/new">
              <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
                <Plus className="size-4 mr-2" />
                Create Booking
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by client name or booking ID..."
              className="pl-10 bg-white"
            />
          </div>
          <Tabs defaultValue="all" className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Photographer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-[#F3F4F6]">
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.client}</TableCell>
                    <TableCell>{booking.package}</TableCell>
                    <TableCell>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      <div className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{booking.photographer}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/bookings/${booking.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

