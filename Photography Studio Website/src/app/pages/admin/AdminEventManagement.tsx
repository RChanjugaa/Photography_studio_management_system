import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Edit, Eye, Trash2, Calendar, MapPin, User, Camera, Download, Upload, X, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import AdminNavigation from '../../components/AdminNavigation';

// Mock events data
const mockEvents = [
  {
    id: 1,
    name: 'Silva-Perera Wedding',
    type: 'Wedding',
    date: '2024-03-25',
    time: '14:00',
    location: 'Galle Face Hotel, Colombo',
    bookingId: 'BK-2024-001',
    photographerId: 1,
    photographerName: 'Amaya Silva',
    status: 'upcoming',
    notes: 'Beach wedding ceremony followed by indoor reception',
    photos: []
  },
  {
    id: 2,
    name: 'Dialog Corporate Event',
    type: 'Corporate',
    date: '2024-03-28',
    time: '09:00',
    location: 'BMICH, Colombo 7',
    bookingId: 'BK-2024-002',
    photographerId: 2,
    photographerName: 'Kasun Fernando',
    status: 'upcoming',
    notes: 'Annual conference with 500+ attendees',
    photos: []
  },
  {
    id: 3,
    name: 'Fernando Birthday Party',
    type: 'Birthday',
    date: '2024-02-15',
    time: '18:00',
    location: 'Cinnamon Grand, Colombo',
    bookingId: 'BK-2024-003',
    photographerId: 1,
    photographerName: 'Amaya Silva',
    status: 'completed',
    notes: '21st birthday celebration',
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-02-15' },
      { id: 2, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-02-15' },
      { id: 3, url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-02-15' },
      { id: 4, url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-02-15' },
      { id: 5, url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-02-15' },
      { id: 6, url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-02-15' },
    ]
  },
  {
    id: 4,
    name: 'Jayawardena-Wickramasinghe Wedding',
    type: 'Wedding',
    date: '2024-01-20',
    time: '16:00',
    location: 'Kingsbury Hotel, Colombo',
    bookingId: 'BK-2024-004',
    photographerId: 1,
    photographerName: 'Amaya Silva',
    status: 'completed',
    notes: 'Traditional Kandyan wedding',
    photos: [
      { id: 7, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-01-20' },
      { id: 8, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-01-20' },
      { id: 9, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1080&h=1080&fit=crop', photographer: 'Amaya Silva', date: '2024-01-20' },
    ]
  }
];

const eventCategories = [
  { type: 'Wedding', color: 'bg-pink-100 border-pink-300 hover:bg-pink-200', count: 2, icon: '💍' },
  { type: 'Birthday', color: 'bg-purple-100 border-purple-300 hover:bg-purple-200', count: 1, icon: '🎂' },
  { type: 'Corporate', color: 'bg-blue-100 border-blue-300 hover:bg-blue-200', count: 1, icon: '💼' },
  { type: 'Cultural', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200', count: 0, icon: '🎭' },
  { type: 'Other', color: 'bg-green-100 border-green-300 hover:bg-green-200', count: 0, icon: '📸' },
];

export default function AdminEventManagement() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEventDrawer, setShowEventDrawer] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  
  // Check admin authentication
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    name: '',
    type: 'Wedding',
    date: '',
    time: '',
    location: '',
    bookingId: '',
    photographerId: '',
    photographerName: '',
    status: 'upcoming',
    notes: ''
  });
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = `${event.name} ${event.type} ${event.location}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsEditing(false);
    setEventForm({
      name: '',
      type: 'Wedding',
      date: '',
      time: '',
      location: '',
      bookingId: '',
      photographerId: '',
      photographerName: '',
      status: 'upcoming',
      notes: ''
    });
    setShowEventDrawer(true);
  };
  
  const handleEditEvent = (event: any) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setEventForm({
      name: event.name,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      bookingId: event.bookingId,
      photographerId: event.photographerId.toString(),
      photographerName: event.photographerName,
      status: event.status,
      notes: event.notes
    });
    setShowEventDrawer(true);
  };
  
  const handleSaveEvent = () => {
    if (!eventForm.name || !eventForm.date || !eventForm.type) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isEditing) {
      setEvents(events.map(evt =>
        evt.id === currentEvent.id
          ? { ...evt, ...eventForm, photographerId: parseInt(eventForm.photographerId) }
          : evt
      ));
      toast.success('Event updated successfully');
    } else {
      const newEvent = {
        id: events.length + 1,
        ...eventForm,
        photographerId: parseInt(eventForm.photographerId),
        photos: []
      };
      setEvents([...events, newEvent]);
      toast.success('Event created successfully');
    }
    
    setShowEventDrawer(false);
  };
  
  const handleViewDetails = (event: any) => {
    setCurrentEvent(event);
    setShowDetailsDrawer(true);
    setSelectedPhotos([]);
  };
  
  const handleDeleteEvent = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(evt => evt.id !== id));
      toast.success('Event deleted successfully');
    }
  };
  
  const handlePhotoSelect = (photoId: number) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };
  
  const handleDownloadSelected = () => {
    if (selectedPhotos.length === 0) {
      toast.error('Please select photos to download');
      return;
    }
    toast.success(`Downloading ${selectedPhotos.length} photos...`);
  };
  
  const handleAddPhotos = () => {
    toast.info('Photo upload feature - to be implemented');
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-900/30 text-blue-300 border-blue-800';
      case 'ongoing':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-800';
      case 'completed':
        return 'bg-green-900/30 text-green-300 border-green-800';
      case 'cancelled':
        return 'bg-red-900/30 text-red-300 border-red-800';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };
  
  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Event Management</h1>
              <p className="text-gray-400">Manage events, assignments, and photo galleries</p>
            </div>
            <Button
              onClick={handleAddEvent}
              className="bg-red-700 hover:bg-red-800 text-white mt-4 md:mt-0"
            >
              <Plus className="size-4 mr-2" />
              Add New Event
            </Button>
          </div>
          
          {/* Event Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {eventCategories.map((category, index) => (
              <motion.div
                key={category.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setTypeFilter(typeFilter === category.type.toLowerCase() ? 'all' : category.type.toLowerCase())}
                  className={`w-full ${category.color} border-2 rounded-lg p-4 transition-all duration-300 ${
                    typeFilter === category.type.toLowerCase() ? 'ring-2 ring-yellow-500' : ''
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.type}</h3>
                  <p className="text-sm text-gray-600">{category.count} Events</p>
                </button>
              </motion.div>
            ))}
          </div>
          
          {/* Filters */}
          <div className="grid md:grid-cols-12 gap-4 mb-8">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search events by name, type, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 bg-gray-900 border-gray-800 text-white"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="wedding">Weddings</SelectItem>
                  <SelectItem value="birthday">Birthdays</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Events Table */}
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Event ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Event Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Photographer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-yellow-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-gray-400 font-mono text-sm">#{event.id.toString().padStart(4, '0')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">{event.name}</div>
                          <div className="text-gray-400 text-sm flex items-center gap-1">
                            <MapPin className="size-3" />
                            {event.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-gray-800 text-gray-300">{event.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{event.date}</div>
                        <div className="text-gray-400 text-xs">{event.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{event.photographerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusBadgeClass(event.status)}>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(event)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="border-gray-700 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Add/Edit Event Drawer */}
        <AnimatePresence>
          {showEventDrawer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowEventDrawer(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="ml-auto h-full w-full max-w-2xl bg-gradient-to-br from-[#2a0f0f] to-black border-l-2 border-gray-800 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-serif text-yellow-500 uppercase">
                      {isEditing ? 'Edit Event' : 'Add New Event'}
                    </h2>
                    <button onClick={() => setShowEventDrawer(false)} className="text-gray-400 hover:text-white">
                      <X className="size-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-gray-300">Event Name *</Label>
                      <Input
                        value={eventForm.name}
                        onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                        placeholder="e.g., Silva-Perera Wedding"
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Event Type *</Label>
                        <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                          <SelectTrigger className="mt-1.5 bg-gray-900 border-gray-800 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800">
                            <SelectItem value="Wedding">Wedding</SelectItem>
                            <SelectItem value="Birthday">Birthday</SelectItem>
                            <SelectItem value="Corporate">Corporate</SelectItem>
                            <SelectItem value="Cultural">Cultural Event</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Booking ID</Label>
                        <Input
                          value={eventForm.bookingId}
                          onChange={(e) => setEventForm({ ...eventForm, bookingId: e.target.value })}
                          placeholder="BK-2024-XXX"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Date *</Label>
                        <Input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Time</Label>
                        <Input
                          type="time"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Location</Label>
                      <Input
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        placeholder="e.g., Galle Face Hotel, Colombo"
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Assign Photographer</Label>
                      <Select value={eventForm.photographerId} onValueChange={(value) => {
                        const photographer = value === '1' ? 'Amaya Silva' : 'Kasun Fernando';
                        setEventForm({ ...eventForm, photographerId: value, photographerName: photographer });
                      }}>
                        <SelectTrigger className="mt-1.5 bg-gray-900 border-gray-800 text-white">
                          <SelectValue placeholder="Select photographer" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          <SelectItem value="1">Amaya Silva</SelectItem>
                          <SelectItem value="2">Kasun Fernando</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Status</Label>
                      <Select value={eventForm.status} onValueChange={(value) => setEventForm({ ...eventForm, status: value })}>
                        <SelectTrigger className="mt-1.5 bg-gray-900 border-gray-800 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Notes</Label>
                      <Textarea
                        value={eventForm.notes}
                        onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                        rows={4}
                        placeholder="Additional event details..."
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-6">
                      <Button
                        onClick={() => setShowEventDrawer(false)}
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveEvent}
                        className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                      >
                        {isEditing ? 'Update' : 'Create'} Event
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Event Details Drawer */}
        <AnimatePresence>
          {showDetailsDrawer && currentEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailsDrawer(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="ml-auto h-full w-full max-w-4xl bg-gradient-to-br from-[#2a0f0f] to-black border-l-2 border-gray-800 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-serif text-yellow-500 uppercase mb-2">{currentEvent.name}</h2>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusBadgeClass(currentEvent.status)}>{currentEvent.status}</Badge>
                        <Badge className="bg-gray-800 text-gray-300">{currentEvent.type}</Badge>
                      </div>
                    </div>
                    <button onClick={() => setShowDetailsDrawer(false)} className="text-gray-400 hover:text-white">
                      <X className="size-6" />
                    </button>
                  </div>
                  
                  {/* Event Details */}
                  <Card className="border-2 border-gray-800 bg-gray-900/50 p-6 mb-8">
                    <h3 className="text-xl font-serif text-yellow-500 mb-4 uppercase">Event Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-400 text-sm">Date & Time</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="size-4 text-yellow-500" />
                          <span className="text-white">{currentEvent.date} at {currentEvent.time}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Location</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="size-4 text-yellow-500" />
                          <span className="text-white">{currentEvent.location}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Photographer</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="size-4 text-yellow-500" />
                          <span className="text-white">{currentEvent.photographerName}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Booking ID</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-white font-mono">{currentEvent.bookingId}</span>
                        </div>
                      </div>
                    </div>
                    {currentEvent.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <Label className="text-gray-400 text-sm">Notes</Label>
                        <p className="text-white mt-1">{currentEvent.notes}</p>
                      </div>
                    )}
                  </Card>
                  
                  {/* Photo Gallery (Only for completed events) */}
                  {currentEvent.status === 'completed' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-serif text-yellow-500 uppercase flex items-center gap-2">
                          <Camera className="size-6" />
                          Event Photo Gallery
                        </h3>
                        <div className="flex gap-2">
                          {selectedPhotos.length > 0 && (
                            <Button
                              onClick={handleDownloadSelected}
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              <Download className="size-4 mr-2" />
                              Download ({selectedPhotos.length})
                            </Button>
                          )}
                          <Button
                            onClick={handleAddPhotos}
                            size="sm"
                            className="bg-red-700 hover:bg-red-800 text-white"
                          >
                            <Upload className="size-4 mr-2" />
                            Add Photos
                          </Button>
                        </div>
                      </div>
                      
                      {currentEvent.photos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentEvent.photos.map((photo: any) => (
                            <motion.div
                              key={photo.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group"
                            >
                              <div
                                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                                  selectedPhotos.includes(photo.id) ? 'ring-4 ring-yellow-500' : ''
                                }`}
                                onClick={() => handlePhotoSelect(photo.id)}
                              >
                                <img
                                  src={photo.url}
                                  alt={`Event photo ${photo.id}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white text-sm font-semibold">{photo.photographer}</p>
                                    <p className="text-gray-300 text-xs">{photo.date}</p>
                                  </div>
                                </div>
                                {selectedPhotos.includes(photo.id) && (
                                  <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                                    <svg className="size-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <Card className="border-2 border-dashed border-gray-700 bg-gray-900/30 p-12 text-center">
                          <Camera className="size-16 text-gray-600 mx-auto mb-4" />
                          <h4 className="text-white text-lg mb-2">No Photos Yet</h4>
                          <p className="text-gray-400 mb-4">Upload photos from this event to create the gallery</p>
                          <Button onClick={handleAddPhotos} className="bg-red-700 hover:bg-red-800 text-white">
                            <Upload className="size-4 mr-2" />
                            Upload Photos
                          </Button>
                        </Card>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8 pt-8 border-t border-gray-800">
                    <Button
                      onClick={() => {
                        setShowDetailsDrawer(false);
                        handleEditEvent(currentEvent);
                      }}
                      className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                    >
                      <Edit className="size-4 mr-2" />
                      Edit Event
                    </Button>
                    <Button
                      onClick={() => setShowDetailsDrawer(false)}
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
