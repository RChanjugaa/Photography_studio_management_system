import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Download, Upload, Share2, Eye, EyeOff, X, Loader } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { galleryAPI } from '../../../services/api';

interface GalleryPhoto {
  id: number;
  booking_id: number;
  image_url: string;
  image_type: string;
  created_at: string;
  selected?: boolean;
}

export default function GalleryView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    if (bookingId) fetchGalleryPhotos();
  }, [bookingId]);

  const fetchGalleryPhotos = async () => {
    if (!bookingId) return;
    try {
      setIsLoading(true);
      const response = await galleryAPI.getByBooking(parseInt(bookingId));
      if (response.success && response.data) {
        setPhotos(response.data.map((photo: GalleryPhoto) => ({ ...photo, selected: false })));
      } else {
        toast.error(response.message || 'Failed to load gallery photos');
      }
    } catch (error) {
      console.error('Error fetching gallery photos:', error);
      toast.error('Error loading photos from database');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCount = photos.filter((photo) => photo.selected).length;

  const handlePhotoSelect = (photoId: number) => {
    setPhotos((state) => state.map((p) => (p.id === photoId ? { ...p, selected: !p.selected } : p)));
  };

  const handleSelectAll = () => {
    const allSelected = photos.every((photo) => photo.selected);
    setPhotos((state) => state.map((p) => ({ ...p, selected: !allSelected })));
  };

  const handleDownloadSelected = () => {
    if (selectedCount === 0) {
      toast.error('Please select photos to download');
      return;
    }
    toast.success(`Preparing ${selectedCount} photos for download...`);
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-yellow-500 mb-4">Invalid Gallery</h2>
          <Link to="/gallery">
            <Button className="bg-red-700 hover:bg-red-800 text-white">Back to Galleries</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="size-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/gallery">
          <Button variant="outline" className="mb-8 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" /> Back to Galleries
          </Button>
        </Link>

        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-serif text-yellow-500 uppercase">Booking #{bookingId}</h1>
              <p className="text-gray-400">{photos.length} photos</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {userRole && <Button onClick={() => navigate(`/gallery/${bookingId}/upload`)} className="bg-red-700 hover:bg-red-800 text-white"><Upload className="size-4 mr-2" />Upload</Button>}
              <Button onClick={() => setSelectionMode(!selectionMode)} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                {selectionMode ? <EyeOff className="size-4 mr-2" /> : <Eye className="size-4 mr-2" />}
                {selectionMode ? 'Cancel' : 'Select'}
              </Button>
            </div>
          </div>

          {selectionMode && (
            <div className="flex items-center gap-3 mb-4">
              <Button onClick={handleSelectAll} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                {photos.every((p) => p.selected) ? 'Deselect All' : 'Select All'}
              </Button>
              <Button onClick={handleDownloadSelected} className="bg-red-700 hover:bg-red-800 text-white">Download Selected</Button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <motion.div key={photo.id} whileHover={{ scale: 1.02 }} className="relative group cursor-pointer" onClick={() => (selectionMode ? handlePhotoSelect(photo.id) : setSelectedPhoto(photo))}>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img src={photo.image_url} alt={`Photo ${photo.id}`} className="w-full h-full object-cover" />
                  {selectionMode && (
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center ${photo.selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <Badge className="bg-red-700 text-white">{photo.selected ? 'Selected' : 'Select'}</Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <AnimatePresence>
          {selectedPhoto && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setSelectedPhoto(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full p-4">
                <img src={selectedPhoto.image_url} alt="Selected" className="w-full h-auto rounded-lg" />
                <Button onClick={() => setSelectedPhoto(null)} className="mt-4 bg-gray-700 hover:bg-gray-800 text-white"><X /></Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
