import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Calendar as CalendarIcon, Package, Plus, ChevronLeft, ChevronRight, Filter, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import AdminNavigation from '../../components/AdminNavigation';

// Mock data
const mockBookings = [
  {
    id: 'BK-1001',
    clientName: 'Sarah & John',
    clientId: 'CL-3001',
    packageName: 'Wedding Gold',
    packageType: 'Wedding',
    scheduledDate: new Date(2026, 2, 21),
    scheduledTime: '14:00 - 20:00',
    photographer: 'David Park',
    status: 'Confirmed',
  },
  {
    id: 'BK-1002',
    clientName: 'Tech Solutions Ltd',
    clientId: 'CL-3002',
    packageName: 'Corporate Event',
    packageType: 'Event',
    scheduledDate: new Date(2026, 2, 25),
    scheduledTime: '10:00 - 16:00',
    photographer: 'Lisa Wong',
    status: 'Pending',
  },
];

const mockPackages = [
  {
    id: 'PKG-101',
    type: 'Wedding',
    title: 'Wedding Gold',
    basePrice: 125000,
    durationHours: 6,
    description: 'Candid + traditional coverage, 2 photographers',
    active: true,
  },
  {
    id: 'PKG-102',
    type: 'Event',
    title: 'Corporate Event',
    basePrice: 85000,
    durationHours: 8,
    description: 'Multi-camera setup, highlight reel',
    active: true,
  },
];

export default function BookingsManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();
  
  // Protect admin route
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.packageType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Completed': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  return (
    <div className="min-h-screen bg-black">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Bookings & Services</h1>
          <p className="text-gray-400">Manage studio bookings, packages and calendar availability</p>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-gray-800">
            <TabsList className="bg-transparent h-auto p-0 space-x-8">
              <TabsTrigger
                value="list"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none pb-3 text-gray-400 data-[state=active]:text-white"
              >
                List
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none pb-3 text-gray-400 data-[state=active]:text-white"
              >
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="packages"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none pb-3 text-gray-400 data-[state=active]:text-white"
              >
                Packages
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* List View */}
          <TabsContent value="list" className="space-y-6 mt-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-500" />
                  <Input
                    placeholder="Search client or booking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Link to="/admin/bookings/new">
                <Button className="bg-red-700 hover:bg-red-800 text-white">
                  <Plus className="size-4 mr-2" />
                  Create Booking
                </Button>
              </Link>
            </div>
            
            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-16">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-800 p-6 rounded-full">
                      <CalendarIcon className="size-12 text-gray-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
                  <p className="text-gray-400 mb-6">Create your first booking to get started.</p>
                  <Link to="/admin/bookings/new">
                    <Button className="bg-red-700 hover:bg-red-800 text-white">
                      <Plus className="size-4 mr-2" />
                      Create Booking
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium text-gray-400 uppercase tracking-wide">
                  <div className="col-span-2">Booking ID</div>
                  <div className="col-span-2">Client</div>
                  <div className="col-span-2">Package</div>
                  <div className="col-span-2">Date & Time</div>
                  <div className="col-span-2">Photographer</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {/* Table Rows */}
                {filteredBookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card className="border-2 border-gray-800 hover:border-yellow-500/50 transition-colors bg-gradient-to-r from-[#2a0f0f] to-black">
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="col-span-2">
                          <div className="font-mono text-yellow-500">{booking.id}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="font-medium text-white">{booking.clientName}</div>
                          <div className="text-sm text-gray-500">{booking.clientId}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-white">{booking.packageName}</div>
                          <div className="text-sm text-gray-500">{booking.packageType}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-white">{format(booking.scheduledDate, 'MMM dd, yyyy')}</div>
                          <div className="text-sm text-gray-500">{booking.scheduledTime}</div>
                        </div>
                        <div className="col-span-2 text-white">
                          {booking.photographer}
                        </div>
                        <div className="col-span-1">
                          <Badge className={`${getStatusColor(booking.status)} border`}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-right">
                          <Link to={`/bookings/${booking.id}`}>
                            <Button variant="ghost" size="sm" className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6 mt-6">
            <CalendarView
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              bookings={mockBookings}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          
          {/* Packages View */}
          <TabsContent value="packages" className="space-y-6 mt-6">
            <PackagesView packages={mockPackages} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Calendar Component
function CalendarView({ currentMonth, setCurrentMonth, bookings, getStatusColor }: {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  bookings: any[];
  getStatusColor: (status: string) => string;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());
  
  const getBookingsForDay = (day: Date) => {
    return bookings.filter(booking => isSameDay(booking.scheduledDate, day));
  };
  
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];
  
  // Mock booked slots for demo
  const bookedSlots = ['10:00 AM', '01:00 PM', '04:00 PM'];
  
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="size-5" />
            </button>
            <h2 className="text-2xl font-serif text-white min-w-[200px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="size-5" />
            </button>
          </div>
          
          <Button onClick={goToToday} variant="outline" className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800">
            Today
          </Button>
        </div>
        
        {/* Calendar Grid */}
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
          {/* Week days header */}
          <div className="grid grid-cols-7 border-b border-gray-800">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square border-r border-b border-gray-800 bg-gray-900/30"></div>
            ))}
            
            {/* Actual days */}
            {days.map((day) => {
              const dayBookings = getBookingsForDay(day);
              const isCurrentDay = isToday(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square border-r border-b border-gray-800 p-2 hover:bg-gray-800/50 transition-colors ${
                    !isSameMonth(day, currentMonth) ? 'bg-gray-900/30' : ''
                  } ${isCurrentDay ? 'bg-yellow-500/10' : ''} ${
                    isSelected ? 'ring-2 ring-yellow-500 ring-inset' : ''
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm mb-1 ${isCurrentDay ? 'font-bold' : ''} ${
                      isCurrentDay ? 'bg-yellow-500 text-black w-7 h-7 rounded-full flex items-center justify-center mx-auto' : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1 flex-1 overflow-hidden">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            booking.status === 'Pending' ? 'bg-blue-500/20 text-blue-400' :
                            booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}
                          title={`${booking.clientName} - ${booking.packageName}`}
                        >
                          {booking.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayBookings.length - 2}</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
      
      {/* Available Times Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-serif text-yellow-500 mb-2 flex items-center gap-2">
            <Clock className="size-5" />
            Available Times
          </h3>
          <p className="text-sm text-gray-400">
            {selectedDay ? format(selectedDay, 'MMMM dd, yyyy') : 'Select a date to view times'}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-400">Not Available</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {timeSlots.map((time) => {
            const isBooked = bookedSlots.includes(time);
            
            return (
              <Card
                key={time}
                className={`p-4 border-2 transition-all ${
                  isBooked
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isBooked ? 'text-red-400' : 'text-green-400'}`}>
                    {time}
                  </span>
                  {isBooked && <span className="text-sm text-red-400">Booked</span>}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Packages Component
function PackagesView({ packages }: { packages: any[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif text-white">Service Packages</h2>
          <p className="text-gray-400 mt-1">Manage your photography and event service packages</p>
        </div>
        <Button className="bg-red-700 hover:bg-red-800 text-white">
          <Plus className="size-4 mr-2" />
          New Package
        </Button>
      </div>
      
      {packages.length === 0 ? (
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-800 p-6 rounded-full">
                <Package className="size-12 text-gray-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No packages yet</h3>
            <p className="text-gray-400 mb-6">Create your first service package to use in bookings.</p>
            <Button className="bg-red-700 hover:bg-red-800 text-white">
              Create Package
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="border-2 border-gray-800 hover:border-yellow-500/50 transition-colors bg-gradient-to-br from-[#2a0f0f] to-black p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    {pkg.type}
                  </Badge>
                  {pkg.active && (
                    <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                      Active
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-serif text-yellow-500 mb-2">{pkg.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base Price</span>
                    <span className="text-white font-semibold">LKR {pkg.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-white">{pkg.durationHours} hours</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}