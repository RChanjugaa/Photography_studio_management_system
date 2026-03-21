import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Download, Upload, Share2, MessageSquare, Eye, EyeOff, Archive, X, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

// Mock gallery data
const mockGalleryData: any = {
  'BK-2024-001': {
    bookingId: 'BK-2024-001',
    title: 'Silva-Perera Wedding',
    eventDate: '2024-03-25',
    location: 'Galle Face Hotel, Colombo',
    status: 'published',
    clientName: 'Silva Family',
    photographerName: 'Amaya Silva',
    rating: 5.0,
    reviewCount: 1,
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&h=1080&fit=crop', selected: false },
      { id: 2, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1080&h=1080&fit=crop', selected: false },
      { id: 3, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1080&h=1080&fit=crop', selected: false },
      { id: 4, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1080&h=1080&fit=crop', selected: false },
      { id: 5, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1080&h=1080&fit=crop', selected: false },
      { id: 6, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1080&h=1080&fit=crop', selected: false },
      { id: 7, url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1080&h=1080&fit=crop', selected: false },
      { id: 8, url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1080&h=1080&fit=crop', selected: false },
      { id: 9, url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1080&h=1080&fit=crop', selected: false },
    ]
  }
};

export default function GalleryView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const gallery = mockGalleryData[bookingId || ''];
  
  const [photos, setPhotos] = useState(gallery?.photos || []);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);
  
  if (!gallery) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-yellow-500 mb-4">Gallery Not Found</h2>
          <Link to="/gallery">
            <Button className="bg-red-700 hover:bg-red-800 text-white">
              Back to Galleries
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const selectedCount = photos.filter((p: any) => p.selected).length;
  
  const handlePhotoSelect = (photoId: number) => {
    setPhotos(photos.map((p: any) => 
      p.id === photoId ? { ...p, selected: !p.selected } : p
    ));
  };
  
  const handleSelectAll = () => {
    const allSelected = photos.every((p: any) => p.selected);
    setPhotos(photos.map((p: any) => ({ ...p, selected: !allSelected })));
  };
  
  const handleDownloadSelected = () => {
    if (selectedCount === 0) {
      toast.error('Please select photos to download');
      return;
    }
    toast.success(`Preparing ${selectedCount} photos for download...`);
  };
  
  const handleDownloadAll = () => {
    toast.success(`Preparing all ${photos.length} photos for download...`);
  };
  
  const handlePublish = () => {
    toast.success('Gallery published successfully');
  };
  
  const handleUnpublish = () => {
    toast.success('Gallery unpublished (moved to draft)');
  };
  
  const handleShare = () => {
    setShowShareModal(true);
  };
  
  const handleCopyShareLink = () => {
    const link = `${window.location.origin}/gallery/public/${bookingId}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied to clipboard');
  };
  
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
        {/* Back Button */}
        <Link to="/gallery">
          <Button variant="outline" className="mb-8 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" />
            Back to Galleries
          </Button>
        </Link>
        
        {/* Gallery Header */}
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-serif text-yellow-500 uppercase">{gallery.title}</h1>
                <Badge className={getStatusBadgeClass(gallery.status)}>
                  {gallery.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">
                  <span className="text-red-700">📅</span> {gallery.eventDate} • {gallery.location}
                </p>
                <p className="text-gray-400">
                  <span className="text-red-700">📷</span> {gallery.photographerName}
                </p>
                <p className="text-gray-400">
                  <span className="text-red-700">🖼️</span> {photos.length} Photos
                </p>
                {gallery.rating && (
                  <p className="text-gray-400">
                    <span className="text-yellow-500">⭐</span> {gallery.rating} ({gallery.reviewCount} review)
                  </p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {userRole === 'client' ? (
                <>
                  <Button
                    onClick={() => setSelectionMode(!selectionMode)}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {selectionMode ? <X className="size-4 mr-2" /> : <Check className="size-4 mr-2" />}
                    {selectionMode ? 'Cancel Select' : 'Select Photos'}
                  </Button>
                  <Button
                    onClick={handleDownloadAll}
                    className="bg-green-700 hover:bg-green-800 text-white"
                  >
                    <Download className="size-4 mr-2" />
                    Download All
                  </Button>
                  <Link to={`/feedback/${bookingId}`}>
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      <MessageSquare className="size-4 mr-2" />
                      Leave Feedback
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={`/gallery/upload/${bookingId}`}>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Upload className="size-4 mr-2" />
                      Upload Photos
                    </Button>
                  </Link>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Share2 className="size-4 mr-2" />
                    Share
                  </Button>
                  {gallery.status === 'published' ? (
                    <Button
                      onClick={handleUnpublish}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <EyeOff className="size-4 mr-2" />
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePublish}
                      className="bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      <Eye className="size-4 mr-2" />
                      Publish
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Selection Actions */}
          {selectionMode && (
            <div className="flex items-center gap-3 pt-6 border-t border-gray-800">
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                {photos.every((p: any) => p.selected) ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedCount > 0 && (
                <>
                  <span className="text-gray-400 text-sm">{selectedCount} selected</span>
                  <Button
                    onClick={handleDownloadSelected}
                    size="sm"
                    className="bg-green-700 hover:bg-green-800 text-white"
                  >
                    <Download className="size-4 mr-2" />
                    Download Selected
                  </Button>
                </>
              )}
            </div>
          )}
        </Card>
        
        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo: any, index: number) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group cursor-pointer"
              onClick={() => {
                if (selectionMode) {
                  handlePhotoSelect(photo.id);
                } else {
                  setSelectedPhoto(photo);
                }
              }}
            >
              <div className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                photo.selected ? 'ring-4 ring-yellow-500' : ''
              }`}>
                <img
                  src={photo.url}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {!selectionMode && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-semibold">Click to view full size</p>
                    </div>
                  )}
                </div>
                {selectionMode && photo.selected && (
                  <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1.5">
                    <Check className="size-4 text-black" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-yellow-500 transition-colors z-10"
            >
              <X className="size-8" />
            </button>
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt="Full size"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-yellow-500 uppercase">Share Gallery</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="size-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="text-gray-300 mb-2 block text-sm">Public Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/gallery/public/${bookingId}`}
                  readOnly
                  className="flex-1 bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white text-sm"
                />
                <Button
                  onClick={handleCopyShareLink}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  Copy
                </Button>
              </div>
              <p className="text-gray-400 text-xs mt-2">Link expires in 30 days</p>
            </div>
            
            <Button
              onClick={() => setShowShareModal(false)}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
