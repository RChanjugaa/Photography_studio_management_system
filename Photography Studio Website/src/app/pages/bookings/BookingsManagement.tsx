import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Calendar as CalendarIcon, Package, Plus, ChevronLeft, ChevronRight, Filter, Clock, BarChart3, TrendingUp, DollarSign, CheckCircle, Trash2, Edit, Printer } from 'lucide-react';
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

  const handlePrint = (booking: any) => {
    const clientName = `${booking.first_name || ''} ${booking.last_name || ''}`.trim() || booking.client_name || 'N/A';
    const eventDate = booking.event_date ? new Date(booking.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';
    const bookingDate = booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const printContent = `<!DOCTYPE html><html><head><title>Booking - ${booking.booking_number}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Georgia,serif;color:#1a1a1a;background:white;}
    .page{width:210mm;min-height:297mm;padding:0;margin:0 auto;position:relative;}
    .header{background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 50%,#c9a84c 100%);padding:30px 50px 50px;display:flex;justify-content:space-between;align-items:center;}
    .logo-text{font-size:36px;font-style:italic;color:#c9a84c;font-family:'Palatino Linotype',Georgia,serif;}
    .tagline{font-size:11px;color:#d4b896;letter-spacing:2px;text-transform:uppercase;margin-top:4px;}
    .contact-section{text-align:right;color:white;font-size:11px;}.contact-section p{margin:3px 0;color:#d4d4d4;}
    .content{padding:40px 50px;}
    .title{text-align:center;font-size:22px;letter-spacing:4px;text-transform:uppercase;color:#1a1a1a;border-bottom:2px solid #c9a84c;border-top:2px solid #c9a84c;padding:12px 0;margin-bottom:35px;}
    .meta{display:flex;justify-content:space-between;margin-bottom:30px;font-size:12px;color:#555;}
    .meta strong{color:#1a1a1a;}
    .section{margin-bottom:25px;border:1px solid #e8e0d0;border-radius:4px;overflow:hidden;}
    .section-header{background:linear-gradient(90deg,#1a1a1a,#2d2d2d);color:#c9a84c;padding:10px 20px;font-size:12px;letter-spacing:2px;text-transform:uppercase;}
    .section-body{padding:20px;}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:15px;}
    .field label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;display:block;margin-bottom:4px;}
    .field span{font-size:13px;color:#1a1a1a;font-weight:600;}
    .total-box{background:linear-gradient(135deg,#1a1a1a,#2d2d2d);color:white;padding:20px 30px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;}
    .total-label{font-size:13px;color:#d4d4d4;letter-spacing:1px;}.total-amount{font-size:28px;color:#c9a84c;font-weight:bold;}
    .thank-you{text-align:center;color:#888;font-size:12px;font-style:italic;margin-bottom:20px;}
    .footer{background:linear-gradient(135deg,#c9a84c 0%,#2d2d2d 50%,#1a1a1a 100%);padding:30px 50px;text-align:center;}
    .footer span{color:#d4b896;font-size:11px;margin:0 20px;}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head>
    <body><div class="page">
    <div class="header"><div class="logo-section"><div class="logo-text">Ambiance</div><div class="tagline">Capturing Timeless Moments</div></div>
    <div class="contact-section"><p>7, 2 Charlemont Rd, Colombo</p><p>+94779774518</p><p>www.ambiance.lk</p></div></div>
    <div class="content"><div class="title">Booking Confirmation</div>
    <div class="meta"><div><strong>Booking #:</strong> ${booking.booking_number || booking.id}</div><div><strong>Bill Date:</strong> ${bookingDate}</div><div><strong>Event Date:</strong> ${eventDate}</div></div>
    <div class="section"><div class="section-header">Client Information</div><div class="section-body"><div class="grid-2">
    <div class="field"><label>Full Name</label><span>${clientName}</span></div>
    <div class="field"><label>Email</label><span>${booking.email || 'N/A'}</span></div>
    <div class="field"><label>Phone</label><span>${booking.phone || 'N/A'}</span></div>
    <div class="field"><label>Client ID</label><span>${booking.client_id || 'N/A'}</span></div>
    </div></div></div>
    <div class="section"><div class="section-header">Booking Details</div><div class="section-body"><div class="grid-2">
    <div class="field"><label>Service Type</label><span>${booking.service_type || 'N/A'}</span></div>
    <div class="field"><label>Event Time</label><span>${booking.event_time || 'N/A'}</span></div>
    <div class="field"><label>Duration</label><span>${booking.duration_hours ? booking.duration_hours + ' hrs' : 'N/A'}</span></div>
    <div class="field"><label>Status</label><span>${booking.status || 'pending'}</span></div>
    </div></div></div>
    <div class="total-box"><div class="total-label">TOTAL AMOUNT</div><div class="total-amount">LKR ${parseFloat(booking.amount || 0).toLocaleString()}</div></div>
    <div class="thank-you">Thank you for choosing Ambiance. We look forward to capturing your timeless moments.</div>
    </div><div class="footer"><span>ambiance.lk</span><span>+94779774518</span><span>studioambiance.lk</span></div>
    </div></body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
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
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="all" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">All Status</SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">Pending</SelectItem>
                    <SelectItem value="confirmed" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">Confirmed</SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">Completed</SelectItem>
                    <SelectItem value="cancelled" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="all" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">All Types</SelectItem>
                    <SelectItem value="Photography" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">Photography</SelectItem>
                    <SelectItem value="Cinematography" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">Cinematography</SelectItem>
                    <SelectItem value="DJ" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">DJ</SelectItem>
                    <SelectItem value="Event Management" className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white">Event Management</SelectItem>
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
                <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-xs font-medium text-gray-400 uppercase tracking-wide">
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
                        {/* Mobile layout */}
                        <div className="block md:hidden px-4 py-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-mono text-yellow-500 text-sm">{booking.booking_number || `#${booking.id}`}</div>
                              <div className="font-medium text-white">{getClientName(booking)}</div>
                              <div className="text-xs text-gray-400">Client ID: {booking.client_id || 'N/A'}</div>
                            </div>
                            <div className="text-orange-400 font-bold text-lg">Rs.{parseFloat(booking.amount || 0).toLocaleString()}</div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>{booking.event_time || 'TBD'}</span>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                            <select
                              className="flex-1 rounded-lg bg-gray-900 border border-gray-700 text-white px-2 py-1 text-xs"
                              value={booking.status || 'pending'}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/10 h-8 w-8 p-0" onClick={() => handlePrint(booking)}><Printer className="size-4" /></Button>
                              <Link to={`/admin/bookings/${booking.id}`}><Button variant="ghost" size="sm" className="text-yellow-500 hover:bg-yellow-500/10 h-8 w-8 p-0"><Edit className="size-4" /></Button></Link>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0" onClick={() => handleDeleteBooking(booking.id)}><Trash2 className="size-4" /></Button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop layout */}
                        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-4 items-center">
                          <div className="col-span-2 min-w-0">
                            <div className="font-mono text-yellow-500 text-xs truncate">{booking.booking_number || `#${booking.id}`}</div>
                            <div className="text-xs text-gray-500 truncate">{getServiceType(booking)}</div>
                          </div>
                          <div className="col-span-2 min-w-0">
                            <div className="font-medium text-white text-sm truncate">{getClientName(booking)}</div>
                            <div className="text-xs text-gray-500">ID: {booking.client_id || 'N/A'}</div>
                          </div>
                          <div className="col-span-2 min-w-0">
                            <div className="text-white text-sm">{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div className="text-xs text-gray-500">{booking.event_time || 'TBD'}</div>
                          </div>
                          <div className="col-span-1 min-w-0">
                            <div className="text-orange-400 font-semibold text-xs">Rs.{parseFloat(booking.amount || 0).toLocaleString()}</div>
                          </div>
                          <div className="col-span-2 text-white text-xs truncate">{assignedEmployees.length ? assignedEmployees.join(', ') : 'Unassigned'}</div>
                          <div className="col-span-2">
                            <select
                              className="w-full rounded bg-gray-900 border border-gray-700 text-white px-1.5 py-1 text-xs"
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
                          <div className="col-span-1 flex justify-end gap-0.5">
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/10 h-7 w-7 p-0" onClick={() => handlePrint(booking)} title="Print"><Printer className="size-3.5" /></Button>
                            <Link to={`/admin/bookings/${booking.id}`}><Button variant="ghost" size="sm" className="text-yellow-500 hover:bg-yellow-500/10 h-7 w-7 p-0"><Edit className="size-3.5" /></Button></Link>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10 h-7 w-7 p-0" onClick={() => handleDeleteBooking(booking.id)}><Trash2 className="size-3.5" /></Button>
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
                    <PackagesView />        
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
                                title={`${booking.clientName} - ${booking.packageType}`}
                              >
                                {booking.clientName}
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
             <p className="text-white text-sm font-medium">{booking.clientName}</p>
             <p className="text-xs text-gray-500">{booking.packageType} - {booking.event_time || 'No time'}</p>
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



function PackagesView() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editPackage, setEditPackage] = useState<any>(null);
  const [form, setForm] = useState({
    title: '', type: 'Wedding', description: '',
    basePrice: '', durationHours: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { packagesAPI } = await import('../../../services/api');
      const response = await packagesAPI.getAll();
      if (response.success) setPackages(response.data);
    } catch (err) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.basePrice) {
      toast.error('Title and price required');
      return;
    }
    try {
      const { packagesAPI } = await import('../../../services/api');
      const payload = {
        title: form.title,
        type: form.type,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
        durationHours: form.durationHours ? parseInt(form.durationHours) : null,
      };
      if (editPackage) {
        await packagesAPI.update(editPackage.id, { ...payload, active: true });
        toast.success('Package updated!');
      } else {
        await packagesAPI.create(payload);
        toast.success('Package created!');
      }
      setShowModal(false);
      setEditPackage(null);
      setForm({ title: '', type: 'Wedding', description: '', basePrice: '', durationHours: '' });
      fetchPackages();
    } catch (err) {
      toast.error('Failed to save package');
    }
  };

  const handleEdit = (pkg: any) => {
    setEditPackage(pkg);
    setForm({
      title: pkg.title,
      type: pkg.type,
      description: pkg.description || '',
      basePrice: pkg.base_price?.toString() || '',
      durationHours: pkg.duration_hours?.toString() || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      const { packagesAPI } = await import('../../../services/api');
      await packagesAPI.delete(id);
      toast.success('Package deleted');
      fetchPackages();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-yellow-500 font-serif uppercase">Service Packages</h3>
        <Button
          onClick={() => { setEditPackage(null); setForm({ title: '', type: 'Wedding', description: '', basePrice: '', durationHours: '' }); setShowModal(true); }}
          className="bg-red-700 hover:bg-red-800 text-white"
        >
          <Plus className="size-4 mr-2" /> Add Package
        </Button>
      </div>

      {/* Package List */}
      {loading ? (
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 text-center">
          <p className="text-gray-400">Loading packages...</p>
        </Card>
      ) : packages.length === 0 ? (
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 text-center">
          <Package className="size-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No packages available yet.</p>
          <Button onClick={() => setShowModal(true)} className="bg-red-700 hover:bg-red-800 text-white">
            <Plus className="size-4 mr-2" /> Add First Package
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="relative border-0 overflow-hidden group cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 40%, #0a0a0a 100%)' }}>
              {/* Gold top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
              
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase mb-2"
                      style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
                      {pkg.type || 'General'}
                    </span>
                    <h4 className="text-xl font-serif text-white tracking-wide">{pkg.title}</h4>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)}
                      className="text-yellow-500 hover:bg-yellow-500/10 h-8 w-8 p-0">
                      <Edit className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)}
                      className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full mb-4" style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.5), transparent)' }} />

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-5 min-h-[40px]">
                  {pkg.description || 'Premium photography service package'}
                </p>

                {/* Features from description */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {(pkg.description || '').split(/[,•]/).filter((f: string) => f.trim()).slice(0, 3).map((feature: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 rounded"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}>
                      ✦ {feature.trim()}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <Clock className="size-3.5" />
                    <span>{pkg.duration_hours || '-'} hrs</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 block text-right">Starting from</span>
                    <span className="text-2xl font-bold" style={{ color: '#c9a84c' }}>
                      Rs.{parseFloat(pkg.base_price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-serif text-yellow-500 mb-6">
              {editPackage ? 'Edit Package' : 'Add New Package'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Package Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Wedding Gold"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm block mb-1">Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Wedding">💍 Wedding</option>
                  <option value="Mehendi">🌿 Mehendi</option>
                  <option value="Preshoot">📸 Pre-Shoot</option>
                  <option value="Engagement">💕 Engagement</option>
                  <option value="Birthday">🎂 Birthday</option>
                  <option value="Corporate">💼 Corporate</option>
                  <option value="Photography">📷 Photography</option>
                  <option value="Cinematography">🎬 Cinematography</option>
                  <option value="DJ">🎵 DJ</option>
                  <option value="Event">🎉 Event</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Package details..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    placeholder="125000"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Duration (hrs)</label>
                  <input
                    type="number"
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: e.target.value })}
                    placeholder="6"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => { setShowModal(false); setEditPackage(null); }}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-red-700 hover:bg-red-800 text-white">
                {editPackage ? 'Update Package' : 'Add Package'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}