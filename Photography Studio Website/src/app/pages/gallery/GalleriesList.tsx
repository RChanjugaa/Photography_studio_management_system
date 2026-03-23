import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, Plus, Image as ImageIcon, Download, Eye, Upload, Share2, Archive } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'motion/react';

// Mock galleries data
const mockGalleries = [
  {
    id: 1,
    bookingId: 'BK-2024-001',
    title: 'Silva-Perera Wedding',
    eventDate: '2024-03-25',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&h=1080&fit=crop',
    photoCount: 124,
    status: 'published',
    clientName: 'Silva Family',
    rating: 5.0,
    downloads: 12
  },
  {
    id: 2,
    bookingId: 'BK-2024-003',
    title: 'Fernando Birthday Party',
    eventDate: '2024-02-15',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1080&h=1080&fit=crop',
    photoCount: 87,
    status: 'published',
    clientName: 'Fernando Family',
    rating: 4.8,
    downloads: 8
  },
  {
    id: 3,
    bookingId: 'BK-2024-005',
    title: 'Perera Corporate Event',
    eventDate: '2024-03-28',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080&h=1080&fit=crop',
    photoCount: 156,
    status: 'draft',
    clientName: 'Perera Enterprises',
    rating: null,
    downloads: 0
  },
  {
    id: 4,
    bookingId: 'BK-2024-004',
    title: 'Jayawardena Wedding',
    eventDate: '2024-01-20',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1080&h=1080&fit=crop',
    photoCount: 203,
    status: 'archived',
    clientName: 'Jayawardena Family',
    rating: 5.0,
    downloads: 15
  }
];

export default function GalleriesList() {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState(mockGalleries);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    // Filter galleries based on role
    if (role === 'client') {
      // In real app, filter by client ID
      setGalleries(mockGalleries.filter(g => g.status === 'published'));
    }
  }, []);
  
  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = `${gallery.title} ${gallery.clientName} ${gallery.bookingId}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gallery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-blue-900/30 text-blue-300 border-blue-800';
      case 'draft':
        return 'bg-gray-800 text-gray-400 border-gray-700';
      case 'archived':
        return 'bg-purple-900/30 text-purple-300 border-purple-800';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Photo Galleries</h1>
            <p className="text-gray-400">
              {userRole === 'client' 
                ? 'View and download your event photos' 
                : 'Manage photo galleries and client deliveries'}
            </p>
          </div>
          {(userRole === 'admin' || userRole === 'staff') && (
            <Link to="/gallery/upload/new">
              <Button className="bg-red-700 hover:bg-red-800 text-white mt-4 md:mt-0">
                <Plus className="size-4 mr-2" />
                Create Gallery
              </Button>
            </Link>
          )}
        </div>
        
        {/* Stats (Admin/Staff only) */}
        {(userRole === 'admin' || userRole === 'staff') && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2 border-blue-800 bg-blue-900/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Galleries</p>
                  <p className="text-2xl font-bold text-blue-400">{galleries.length}</p>
                </div>
                <ImageIcon className="size-10 text-blue-400" />
              </div>
            </Card>
            <Card className="border-2 border-green-800 bg-green-900/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Published</p>
                  <p className="text-2xl font-bold text-green-400">
                    {galleries.filter(g => g.status === 'published').length}
                  </p>
                </div>
                <Eye className="size-10 text-green-400" />
              </div>
            </Card>
            <Card className="border-2 border-yellow-800 bg-yellow-900/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-400">4.9</p>
                </div>
                <div className="text-yellow-400 text-3xl">⭐</div>
              </div>
            </Card>
            <Card className="border-2 border-purple-800 bg-purple-900/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Photos</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {galleries.reduce((sum, g) => sum + g.photoCount, 0)}
                  </p>
                </div>
                <Upload className="size-10 text-purple-400" />
              </div>
            </Card>
          </div>
        )}
        
        {/* Filters */}
        <div className="grid md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search galleries by title, client, or booking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-gray-900 border-gray-800 text-white"
              />
            </div>
          </div>
          {(userRole === 'admin' || userRole === 'staff') && (
            <div className="md:col-span-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {/* Galleries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery, index) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/gallery/${gallery.bookingId}`}>
                <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden group hover:border-yellow-500 transition-all duration-300">
                  {/* Cover Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={gallery.coverImage}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={getStatusBadgeClass(gallery.status)}>
                        {gallery.status}
                      </Badge>
                    </div>
                    
                    {/* Photo Count */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <ImageIcon className="size-4 text-yellow-500" />
                      <span className="text-white text-sm font-semibold">{gallery.photoCount} Photos</span>
                    </div>
                    
                    {/* Rating (if available) */}
                    {gallery.rating && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-yellow-500 text-sm">⭐</span>
                        <span className="text-white text-sm font-semibold">{gallery.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Gallery Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-yellow-500 mb-2 group-hover:text-yellow-400 transition-colors">
                      {gallery.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span className="text-red-700">📅</span>
                        <span>{gallery.eventDate}</span>
                      </div>
                      {(userRole === 'admin' || userRole === 'staff') && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <span className="text-red-700">👤</span>
                          <span>{gallery.clientName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Download className="size-3 text-red-700" />
                        <span>{gallery.downloads} Downloads</span>
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
        {filteredGalleries.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon className="size-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-500 mb-2">No Galleries Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
