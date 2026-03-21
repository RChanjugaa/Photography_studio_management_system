import { useState } from 'react';
import { Search, Calendar, MapPin, Camera, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { motion } from 'motion/react';

// Mock completed events (public view)
const publicEvents = [
  {
    id: 3,
    name: 'Fernando Birthday Party',
    type: 'Birthday',
    date: '2024-02-15',
    location: 'Cinnamon Grand, Colombo',
    photographerName: 'Amaya Silva',
    photoCount: 6,
    coverPhoto: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1080&h=1080&fit=crop'
  },
  {
    id: 4,
    name: 'Jayawardena-Wickramasinghe Wedding',
    type: 'Wedding',
    date: '2024-01-20',
    location: 'Kingsbury Hotel, Colombo',
    photographerName: 'Amaya Silva',
    photoCount: 3,
    coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&h=1080&fit=crop'
  },
  {
    id: 5,
    name: 'Tech Conference 2024',
    type: 'Corporate',
    date: '2024-01-10',
    location: 'BMICH, Colombo 7',
    photographerName: 'Kasun Fernando',
    photoCount: 8,
    coverPhoto: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080&h=1080&fit=crop'
  },
  {
    id: 6,
    name: 'Perera-De Silva Engagement',
    type: 'Wedding',
    date: '2023-12-15',
    location: 'Galle Face Hotel, Colombo',
    photographerName: 'Amaya Silva',
    photoCount: 12,
    coverPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1080&h=1080&fit=crop'
  },
  {
    id: 7,
    name: 'Annual Gala Dinner',
    type: 'Corporate',
    date: '2023-11-30',
    location: 'Hilton Colombo',
    photographerName: 'Kasun Fernando',
    photoCount: 15,
    coverPhoto: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1080&h=1080&fit=crop'
  },
  {
    id: 8,
    name: 'Cultural Festival',
    type: 'Cultural',
    date: '2023-11-15',
    location: 'Nelum Pokuna Theatre',
    photographerName: 'Amaya Silva',
    photoCount: 20,
    coverPhoto: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1080&h=1080&fit=crop'
  }
];

export default function EventsGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const filteredEvents = publicEvents.filter(event => {
    const matchesSearch = `${event.name} ${event.type} ${event.location}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-yellow-500 mb-4 uppercase"
          >
            Past Events Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Browse our collection of beautifully captured moments from weddings, birthdays, corporate events, and more
          </motion.p>
        </div>
        
        {/* Filters */}
        <div className="grid md:grid-cols-12 gap-4 mb-12">
          <div className="md:col-span-8">
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
          <div className="md:col-span-4">
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
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/events/${event.id}`}>
                <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden group hover:border-yellow-500 transition-all duration-300">
                  {/* Cover Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={event.coverPhoto}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    
                    {/* Photo Count Badge */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                      <Camera className="size-4 text-yellow-500" />
                      <span className="text-white text-sm font-semibold">{event.photoCount} Photos</span>
                    </div>
                    
                    {/* Event Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-700 text-white border-0">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Event Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-yellow-500 mb-3 group-hover:text-yellow-400 transition-colors">
                      {event.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="size-4 text-red-700" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="size-4 text-red-700" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Camera className="size-4 text-red-700" />
                        <span className="text-sm">{event.photographerName}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-red-700 hover:bg-red-800 text-white group-hover:bg-yellow-500 group-hover:text-black transition-all">
                      <Eye className="size-4 mr-2" />
                      View Gallery
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Camera className="size-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-500 mb-2">No Events Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
