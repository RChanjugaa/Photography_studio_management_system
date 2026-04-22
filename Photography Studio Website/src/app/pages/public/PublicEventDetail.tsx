import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Calendar, MapPin, Camera, ArrowLeft, Download, X } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

// Mock event data with photos
const mockEventDetails: any = {
  3: {
    id: 3,
    name: 'Fernando Birthday Party',
    type: 'Birthday',
    date: '2024-02-15',
    location: 'Cinnamon Grand, Colombo',
    photographerName: 'Amaya Silva',
    description: 'A beautiful 21st birthday celebration captured with elegance and joy. The event featured stunning decorations, heartfelt moments, and unforgettable memories.',
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1080&h=1080&fit=crop' },
      { id: 2, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1080&h=1080&fit=crop' },
      { id: 3, url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1080&h=1080&fit=crop' },
      { id: 4, url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1080&h=1080&fit=crop' },
      { id: 5, url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1080&h=1080&fit=crop' },
      { id: 6, url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1080&h=1080&fit=crop' },
    ]
  },
  4: {
    id: 4,
    name: 'Jayawardena-Wickramasinghe Wedding',
    type: 'Wedding',
    date: '2024-01-20',
    location: 'Kingsbury Hotel, Colombo',
    photographerName: 'Amaya Silva',
    description: 'A traditional Kandyan wedding ceremony followed by a grand reception. Every moment of this special day was captured with care and artistic vision.',
    photos: [
      { id: 7, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&h=1080&fit=crop' },
      { id: 8, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1080&h=1080&fit=crop' },
      { id: 9, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1080&h=1080&fit=crop' },
    ]
  }
};

export default function PublicEventDetail() {
  const { eventId } = useParams();
  const event = mockEventDetails[eventId || '3'];
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  
  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-yellow-500 mb-4">Event Not Found</h2>
          <Link to="/events-gallery">
            <Button className="bg-red-700 hover:bg-red-800 text-white">
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/events-gallery">
          <Button variant="outline" className="mb-8 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" />
            Back to Events
          </Button>
        </Link>
        
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-3 uppercase">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-red-700 text-white border-0 text-sm">
                  {event.type}
                </Badge>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">{event.photos.length} Photos</span>
              </div>
            </div>
          </div>
          
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <Calendar className="size-6 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="text-white font-semibold">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <MapPin className="size-6 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-semibold">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <Camera className="size-6 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Photographer</p>
                  <p className="text-white font-semibold">{event.photographerName}</p>
                </div>
              </div>
            </div>
            {event.description && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            )}
          </Card>
        </motion.div>
        
        {/* Photo Gallery */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-serif text-yellow-500 uppercase">Event Gallery</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.photos.map((photo: any, index: number) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={`Event photo ${photo.id}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-semibold">Click to view full size</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                  onClick={() => setSelectedPhoto(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
