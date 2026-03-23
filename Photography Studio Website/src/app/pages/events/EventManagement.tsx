import { useState } from 'react';
import { Plus, Search, Calendar, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export default function EventManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { type: 'Wedding', color: 'bg-pink-100 text-pink-700', count: 45, icon: '💒' },
    { type: 'Birthday', color: 'bg-purple-100 text-purple-700', count: 28, icon: '🎂' },
    { type: 'Corporate', color: 'bg-blue-100 text-blue-700', count: 32, icon: '💼' },
    { type: 'Cultural Event', color: 'bg-orange-100 text-orange-700', count: 15, icon: '🎭' },
    { type: 'Other Events', color: 'bg-green-100 text-green-700', count: 12, icon: '🎉' },
  ];
  
  const mockEvents = [
    {
      id: 'EVT-301',
      name: 'Johnson Wedding',
      type: 'Wedding',
      date: '2026-03-20',
      bookingId: 'BK-1205',
      photographer: 'Sarah Williams',
      status: 'Upcoming',
      location: 'Grand Hotel',
    },
    {
      id: 'EVT-298',
      name: 'Tech Summit 2026',
      type: 'Corporate',
      date: '2026-02-15',
      bookingId: 'BK-1189',
      photographer: 'Mike Chen',
      status: 'Completed',
      location: 'Convention Center',
    },
    {
      id: 'EVT-295',
      name: 'Birthday Celebration - Emma',
      type: 'Birthday',
      date: '2026-04-05',
      bookingId: 'BK-1210',
      photographer: 'Not Assigned',
      status: 'Upcoming',
      location: 'Garden Venue',
    },
  ];
  
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Event Management</h1>
            <p className="text-gray-600">Manage events, assign photographers, and view galleries</p>
          </div>
          <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
            <Plus className="size-4 mr-2" />
            Add New Event
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by event type, client, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        
        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => (
            <Card
              key={category.type}
              onClick={() => setSelectedCategory(selectedCategory === category.type ? null : category.type)}
              className={`p-4 cursor-pointer transition-all border-2 ${
                selectedCategory === category.type
                  ? 'border-[#4C8BF5] shadow-md'
                  : 'border-transparent hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-semibold text-sm text-[#1F2937]">{category.type}</div>
                <div className="text-2xl font-bold text-[#4C8BF5] mt-1">{category.count}</div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Events Table */}
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Photographer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-[#F3F4F6]">
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>
                      <div className="font-semibold">{event.name}</div>
                      <div className="text-sm text-gray-500">Booking: {event.bookingId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={categories.find(c => c.type === event.type)?.color}>
                        {event.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-gray-400" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-gray-400" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-gray-400" />
                        {event.photographer}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                          event.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/events/${event.id}`}>
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

