import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, Image as ImageIcon, Loader, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { galleryAPI } from '../../../services/api';

interface GalleryPhoto {
  id: number;
  booking_id: number;
  booking_number?: string;
  first_name?: string;
  last_name?: string;
  image_url: string;
  image_type: string;
  created_at: string;
}

export default function GalleriesList() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await galleryAPI.getAll();
      if (response.success && response.data) {
        setPhotos(response.data);
      } else {
        toast.error(response.message || 'Failed to load gallery data');
      }
    } catch (error) {
      console.error('Gallery fetch error', error);
      toast.error('Failed to fetch gallery from database');
    } finally {
      setIsLoading(false);
    }
  };

  const galleriesByBooking = photos.reduce((acc: Record<string, any>, photo) => {
    const key = String(photo.booking_id);
    if (!acc[key]) {
      acc[key] = {
        bookingId: photo.booking_id,
        bookingNumber: photo.booking_number || `BK-${photo.booking_id}`,
        clientName: `${photo.first_name || 'Client'} ${photo.last_name || ''}`.trim(),
        coverImage: photo.image_url,
        photoCount: 0,
        updatedAt: photo.created_at
      };
    }
    acc[key].photoCount += 1;
    return acc;
  }, {});

  const galleryItems = Object.values(galleriesByBooking).filter((g) =>
    `${g.bookingNumber} ${g.clientName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Galleries</h1>
            <p className="text-gray-400">Manage photo galleries and client deliveries</p>
          </div>
          {(userRole === 'admin' || userRole === 'staff') && (
            <Link to="/gallery/upload/1">
              <Button className="bg-red-700 hover:bg-red-800 text-white">
                <Upload className="size-4 mr-2" />
                Upload Photos
              </Button>
            </Link>
          )}
        </div>

        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-5 text-gray-500" />
            <Input
              className="pl-10 bg-gray-900 border-gray-800 text-white"
              placeholder="Search by booking or client"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="size-8 animate-spin text-yellow-500" />
            <span className="ml-2 text-gray-400">Loading galleries...</span>
          </div>
        ) : galleryItems.length === 0 ? (
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-12 text-center">
            <ImageIcon className="size-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">No gallery records available.</p>
          </Card>
        ) : (
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((gallery: any) => (
              <motion.div
                key={gallery.bookingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  onClick={() => navigate(`/gallery/${gallery.bookingId}`)}
                  className="cursor-pointer border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black hover:border-yellow-500"
                >
                  <div className="relative h-48 overflow-hidden rounded-lg">
                    <img src={gallery.coverImage} alt={gallery.bookingNumber} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-red-700 text-white">{gallery.photoCount} photos</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-yellow-500 uppercase">{gallery.bookingNumber}</h3>
                    <p className="text-gray-400">{gallery.clientName}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
