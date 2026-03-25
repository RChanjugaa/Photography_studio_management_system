import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Calendar as CalendarIcon, Package, Plus, ChevronLeft, ChevronRight, Filter, Clock, BarChart3, TrendingUp, DollarSign, CheckCircle, Trash2, Edit } from 'lucide-react';
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
import { bookingsAPI } from '../../../services/api';

export default function BookingsManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error fetching bookings from server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;

    try {
      const response = await bookingsAPI.delete(id);
      if (response.success) {
        toast.success('Booking deleted successfully');
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
      } else {
        toast.error(response.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Error deleting booking');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await bookingsAPI.updateStatus(id, status);
      if (response.success) {
        toast.success('Booking status updated');
        setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating booking status');
    }
  };

  const getClientName = (booking: any) => {
    if (booking.first_name || booking.last_name) {
      return `${booking.first_name || ''} ${booking.last_name || ''}`.trim();
    }
    if (booking.client_name) return booking.client_name;
    return booking.clientId || 'Unknown Client';
  };

  const getServiceType = (booking: any) => booking.service_type || booking.packageType || 'N/A';

  const filteredBookings = bookings.filter((booking) => {
    const clientName = getClientName(booking).toLowerCase();
    const bookingCode = (booking.booking_number || booking.id || '').toString().toLowerCase();

    const matchesSearch =
      clientName.includes(searchQuery.toLowerCase()) ||
      bookingCode.includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || getServiceType(booking).toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    totalRevenue: bookings.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'completed':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Bookings Management</h1>
            <p className="text-gray-400">Manage all booking requests and confirmations</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link to="/admin/bookings/new">
              <Button className="bg-red-700 hover:bg-red-800 text-white">
                <Plus className="size-4 mr-2" /> Create Booking
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-yellow-500">{bookingStats.total}</p>
              </div>
              <BarChart3 className="size-10 text-yellow-500 opacity-50" />
            </div>
          </Card>
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-blue-400">{bookingStats.pending}</p>
              </div>
              <Clock className="size-10 text-blue-400 opacity-50" />
            </div>
          </Card>
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-400">{bookingStats.confirmed}</p>
              </div>
              <CheckCircle className="size-10 text-green-400 opacity-50" />
            </div>
          </Card>
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-purple-400">{bookingStats.completed}</p>
              </div>
              <TrendingUp className="size-10 text-purple-400 opacity-50" />
            </div>
          </Card>
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-400">Rs.{(bookingStats.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <DollarSign className="size-10 text-orange-400 opacity-50" />
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-gray-800">
            <TabsList className="bg-transparent h-auto p-0 space-x-8">
              <TabsTrigger value="list" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none pb-3 text-gray-400 data-[state=active]:text-white">
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none pb-3 text-gray-400 data-[state=active]:text-white">
                Calendar
              </TabsTrigger>
              <TabsTrigger value="packages" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none pb-3 text-gray-400 data-[state=active]:text-white">
                Packages
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="space-y-6 mt-6">
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Cinematography">Cinematography</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Event Management">Event Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-16 text-center">
                <p className="text-gray-400">Loading bookings...</p>
              </Card>
            ) : filteredBookings.length === 0 ? (
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
                <div className="grid grid-cols-12 gap-3 px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium text-gray-400 uppercase tracking-wide">
                  <div className="col-span-2">Booking #</div>
                  <div className="col-span-2">Client</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-2">Service</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                {filteredBookings.map((booking, idx) => {
                  const eventDate = booking.event_date ? new Date(booking.event_date) : new Date(booking.booking_date);
                  const assignedEmployees = Array.isArray(booking.assigned_employees) ? booking.assigned_employees : (booking.assigned_employees ? JSON.parse(booking.assigned_employees) : []);

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                    >
                      <Card className="border-2 border-gray-800 hover:border-yellow-500/50 transition-colors bg-gradient-to-r from-[#2a0f0f] to-black">
                        <div className="grid grid-cols-12 gap-3 px-6 py-4 items-center">
                          <div className="col-span-2">
                            <div className="font-mono text-yellow-500 text-sm">{booking.booking_number || `#${booking.id}`}</div>
                            <div className="text-xs text-gray-500">{getServiceType(booking)}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="font-medium text-white text-sm">{getClientName(booking)}</div>
                            <div className="text-xs text-gray-500">Client ID: {booking.client_id || 'N/A'}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-white text-sm">{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div className="text-xs text-gray-500">{booking.event_time || 'TBD'}</div>
                          </div>
                          <div className="col-span-1">
                            <div className="text-orange-400 font-semibold text-sm">Rs.{parseFloat(booking.amount || 0).toLocaleString()}</div>
                          </div>
                          <div className="col-span-2 text-white text-sm">{assignedEmployees.length ? assignedEmployees.join(', ') : 'Unassigned'}</div>
                          <div className="col-span-2">
                            <select
                              className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-2 py-1 text-xs"
                              value={booking.status || 'pending'}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          <div className="col-span-1 text-right flex justify-end gap-1">
                            <Link to={`/admin/bookings/${booking.id}`}>
                              <Button variant="ghost" size="sm" className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10">
                                <Edit className="size-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDeleteBooking(booking.id)}>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6 mt-6">
            <CalendarView
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              bookings={bookings.map((booking) => ({
                ...booking,
                scheduledDate: booking.event_date ? new Date(booking.event_date) : new Date(booking.booking_date),
                status: booking.status || 'pending',
                clientName: getClientName(booking),
                packageType: getServiceType(booking),
                packageName: getServiceType(booking),
              }))}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="packages" className="space-y-6 mt-6">
            <PackagesView packages={[] /* keep existing local packing sample or integrate real packages here */} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
    return bookings.filter((booking) => isSameDay(new Date(booking.scheduledDate), day));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
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

        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-800">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square border-r border-b border-gray-800 bg-gray-900/30"></div>
            ))}
            {days.map((day) => {
              const dayBookings = getBookingsForDay(day);
              const isCurrentDay = isToday(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square border-r border-b border-gray-800 p-2 hover:bg-gray-800/50 transition-colors ${!isSameMonth(day, currentMonth) ? 'bg-gray-900/30' : ''} ${isCurrentDay ? 'bg-yellow-500/10' : ''} ${isSelected ? 'ring-2 ring-yellow-500 ring-inset' : ''}`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm mb-1 ${isCurrentDay ? 'font-bold' : ''} ${isCurrentDay ? 'bg-yellow-500 text-black w-7 h-7 rounded-full flex items-center justify-center mx-auto' : 'text-gray-400'}`}>
                      {format(day, 'd')}
                    </div>

                    <div className="space-y-1 flex-1 overflow-hidden">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${booking.status === 'pending' ? 'bg-blue-500/20 text-blue-400' : booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                          title={`${getClientName(booking)} - ${getServiceType(booking)}`}
                        >
                          {getClientName(booking)}
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-400">Selected day</p>
          <p className="text-sm text-gray-400">{selectedDay ? format(selectedDay, 'MMM dd, yyyy') : 'None'}</p>
        </div>
        <div className="space-y-2">
          {(selectedDay ? getBookingsForDay(selectedDay) : []).map((booking) => (
            <div key={booking.id} className="p-3 border border-gray-800 rounded-lg bg-black">
              <p className="text-white text-sm font-medium">{getClientName(booking)}</p>
              <p className="text-xs text-gray-500">{getServiceType(booking)} - {booking.event_time || 'No time'}</p>
              <Badge className={`${getStatusColor(booking.status || 'pending')} border text-xs`}>{booking.status || 'pending'}</Badge>
            </div>
          ))}
          {selectedDay && getBookingsForDay(selectedDay).length === 0 && (
            <p className="text-gray-500 text-sm">No bookings for selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PackagesView({ packages }: { packages: any[] }) {
  return (
    <div className="space-y-4">
      {packages.length === 0 ? (
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
          <p className="text-gray-400">No packages available yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-white font-semibold">{pkg.title}</p>
                <Badge className="bg-yellow-500 text-black">{pkg.type}</Badge>
              </div>
              <p className="text-gray-400 text-sm">{pkg.description}</p>
              <p className="text-white font-semibold mt-3">Rs.{pkg.basePrice}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
