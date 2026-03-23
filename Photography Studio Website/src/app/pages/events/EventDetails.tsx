import { ArrowLeft, Calendar, MapPin, User, Upload, Image as ImageIcon } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function EventDetails() {
  const { eventId } = useParams();
  
  // Mock data
  const event = {
    id: eventId,
    name: 'Johnson Wedding',
    type: 'Wedding',
    date: '2026-03-20',
    location: 'Grand Hotel, Colombo',
    address: '123 Galle Road, Colombo 03',
    photographer: 'Sarah Williams',
    status: 'Completed',
    bookingId: 'BK-1205',
    notes: 'Outdoor ceremony at 4 PM, indoor reception at 6 PM. Focus on candid moments.',
    photos: [
      'https://images.unsplash.com/photo-1647730346059-c7c75506451e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop',
    ],
  };
  
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#4C8BF5] mb-6">
          <ArrowLeft className="size-4" />
          Back to Events
        </Link>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">{event.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <Calendar className="size-4" />
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <Badge className="bg-green-100 text-green-700">{event.status}</Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Edit Event</Button>
            <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
              <Upload className="size-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery ({event.photos.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Event Information */}
              <Card className="p-6 bg-white border-none shadow-sm">
                <h2 className="text-xl font-bold text-[#1F2937] mb-4">Event Information</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Event Type</div>
                    <Badge className="bg-pink-100 text-pink-700">{event.type}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Event ID</div>
                    <div className="font-medium">{event.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Linked Booking</div>
                    <Link to={`/bookings/${event.bookingId}`} className="text-[#4C8BF5] hover:underline">
                      {event.bookingId}
                    </Link>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <MapPin className="size-4" />
                      Location
                    </div>
                    <div className="font-medium">{event.location}</div>
                    <div className="text-sm text-gray-600">{event.address}</div>
                  </div>
                </div>
              </Card>
              
              {/* Assignment & Notes */}
              <Card className="p-6 bg-white border-none shadow-sm">
                <h2 className="text-xl font-bold text-[#1F2937] mb-4">Assignment & Notes</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <User className="size-4" />
                      Assigned Photographer
                    </div>
                    <div className="font-medium">{event.photographer}</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Assignment
                    </Button>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Notes</div>
                    <div className="text-sm bg-[#F3F4F6] p-3 rounded-lg">{event.notes}</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card className="p-6 bg-white border-none shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1F2937]">Event Gallery</h2>
                <div className="flex gap-3">
                  <Button variant="outline">Download All</Button>
                  <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
                    <Upload className="size-4 mr-2" />
                    Add More Photos
                  </Button>
                </div>
              </div>
              
              {event.photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden group relative cursor-pointer"
                    >
                      <img
                        src={photo}
                        alt={`Event photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="size-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No photos uploaded yet</p>
                  <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
                    <Upload className="size-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

