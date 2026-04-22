import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Award, Calendar, Mail, Star, MapPin, Camera, Play } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';

// Mock employee data
const mockEmployeeData = {
  1: {
    id: 1,
    firstName: 'Amaya',
    lastName: 'Silva',
    role: 'Lead Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&h=600&fit=crop',
    bio: `Amaya is a passionate wedding and portrait photographer with over 8 years of experience in the industry. She specializes in capturing authentic emotions and timeless moments that tell your unique story.

Her work has been featured in several international wedding publications, and she has photographed over 200 weddings across Sri Lanka and abroad. Amaya believes in creating a comfortable, fun atmosphere that allows her clients' true personalities to shine through.

When she's not behind the camera, Amaya enjoys teaching photography workshops and mentoring aspiring photographers. Her creative eye and dedication to excellence make her one of the most sought-after photographers at Ambiance.`,
    yearsExperience: 8,
    rating: 4.9,
    totalReviews: 127,
    joinDate: '2016-03-15',
    specialties: ['Weddings', 'Portraits', 'Studio', 'Destination'],
    certifications: ['Professional Photographer Certification', 'Adobe Certified Expert', 'Wedding Photography Specialist'],
    portfolio: [
      { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&h=1080&fit=crop', title: 'Beach Wedding' },
      { id: 2, url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1080&h=1080&fit=crop', title: 'Garden Ceremony' },
      { id: 3, url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1080&h=1080&fit=crop', title: 'Couple Portrait' },
      { id: 4, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1080&h=1080&fit=crop', title: 'Reception Details' },
      { id: 5, url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1080&h=1080&fit=crop', title: 'First Dance' },
      { id: 6, url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1080&h=1080&fit=crop', title: 'Bridal Portrait' }
    ],
    workHighlights: [
      { id: 1, title: 'Luxury Beach Wedding - Bentota', date: '2024-02-14', type: 'Wedding' },
      { id: 2, title: 'Corporate Headshots - Dialog Axiata', date: '2024-01-20', type: 'Corporate' },
      { id: 3, title: 'Family Portraits - Colombo', date: '2024-01-10', type: 'Portrait' }
    ],
    location: 'Colombo, Sri Lanka'
  }
};

export default function EmployeeProfile() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  useEffect(() => {
    // Mock API call - replace with actual API
    const data = mockEmployeeData[employeeId as keyof typeof mockEmployeeData];
    if (data) {
      setEmployee(data);
    }
  }, [employeeId]);
  
  if (!employee) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Cover Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={employee.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>
        
        {/* Back Button */}
        <Link
          to="/employees"
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-yellow-500 transition-colors bg-black/50 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="size-4" />
          Back to Team
        </Link>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={employee.avatar}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-40 h-40 rounded-2xl object-cover border-4 border-yellow-500"
                />
              </div>
              
              {/* Info */}
              <div className="flex-grow">
                <h1 className="text-4xl font-serif text-yellow-500 mb-2">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-xl text-white mb-4">{employee.role}</p>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Camera className="size-5" />
                    <span>{employee.yearsExperience}+ Years</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star className="size-5 text-yellow-500 fill-yellow-500" />
                    <span>{employee.rating} ({employee.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="size-5" />
                    <span>{employee.location}</span>
                  </div>
                </div>
                
                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {employee.specialties.map((specialty: string) => (
                    <Badge
                      key={specialty}
                      className="bg-red-900/30 text-red-300 border border-red-800"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Link to="/client/login">
                  <Button className="bg-red-700 hover:bg-red-800 text-white">
                    Request This Photographer
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - About & Certifications */}
          <div className="lg:col-span-1 space-y-8">
            {/* About */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h2 className="text-2xl font-serif text-yellow-500 mb-4 uppercase">About</h2>
              <div className="text-gray-400 space-y-4 whitespace-pre-line">
                {employee.bio}
              </div>
            </Card>
            
            {/* Certifications */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h2 className="text-2xl font-serif text-yellow-500 mb-4 uppercase flex items-center gap-2">
                <Award className="size-6" />
                Certifications
              </h2>
              <ul className="space-y-3">
                {employee.certifications.map((cert: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                    <span className="text-gray-400">{cert}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Work Highlights */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h2 className="text-2xl font-serif text-yellow-500 mb-4 uppercase">Recent Work</h2>
              <div className="space-y-4">
                {employee.workHighlights.map((work: any) => (
                  <div key={work.id} className="border-b border-gray-800 last:border-0 pb-4 last:pb-0">
                    <h4 className="text-white font-semibold mb-1">{work.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Badge className="bg-gray-800 text-gray-400 border-0 text-xs">
                        {work.type}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(work.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Right Column - Portfolio */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h2 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Portfolio</h2>
              
              {/* Portfolio Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {employee.portfolio.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-semibold">{item.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Image Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white hover:text-yellow-500 text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={employee.portfolio[selectedImage].url}
            alt={employee.portfolio[selectedImage].title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
