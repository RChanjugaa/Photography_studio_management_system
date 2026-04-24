import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, Camera, Award, Users, Heart, Star, ArrowRight, Music, Zap, PartyPopper } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { galleryAPI } from '../../services/api';

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [serviceMode, setServiceMode] = useState('photography'); // 'photography' or 'events'
  const [eventType, setEventType] = useState('dj'); // 'dj', 'music', 'party', 'wedding'
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  
  // Photography Mode Data
  const photographySlides = [
    {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop',
      title: 'Capturing Your Perfect Moments',
      subtitle: 'Professional Wedding Photography'
    },
    {
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&h=1080&fit=crop',
      title: 'Timeless Memories',
      subtitle: 'Event & Studio Photography'
    },
    {
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920&h=1080&fit=crop',
      title: 'Your Story, Beautifully Told',
      subtitle: 'Cinematography & Film Production'
    },
  ];

  // Event Management Mode Data - Different Event Types
  const djEventSlides = [
    {
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop',
      title: 'DJ Services That Rock',
      subtitle: 'Professional DJ Entertainment for Every Occasion'
    },
    {
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop',
      title: 'Keep The Party Going',
      subtitle: 'High-Energy Music Mixes & Sound Systems'
    },
  ];

  const liveMusic = [
    {
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1920&h=1080&fit=crop',
      title: 'Live Music Entertainment',
      subtitle: 'Professional Bands & Musicians for Every Vibe'
    },
    {
      image: 'https://images.unsplash.com/photo-1459899677411-b2a3e9fe47f4?w=1920&h=1080&fit=crop',
      title: 'Create an Unforgettable Atmosphere',
      subtitle: 'Live Performances That Set the Mood'
    },
  ];

  const partyEventSlides = [
    {
      image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=1920&h=1080&fit=crop',
      title: 'Epic Party Planning',
      subtitle: 'Full Entertainment & Event Coordination'
    },
    {
      image: 'https://images.unsplash.com/photo-1533995405351-cf8e61c22f29?w=1920&h=1080&fit=crop',
      title: 'Celebrations Like No Other',
      subtitle: 'Complete Party Management Services'
    },
  ];

  const weddingEventSlides = [
    {
      image: 'https://images.unsplash.com/photo-1519671482677-e62b29289a84?w=1920&h=1080&fit=crop',
      title: 'Unforgettable Wedding Entertainment',
      subtitle: 'DJ, Music, Décor & Full Event Coordination'
    },
    {
      image: 'https://images.unsplash.com/photo-1519224871644-cbbeef61bf0b?w=1920&h=1080&fit=crop',
      title: 'Your Perfect Celebration',
      subtitle: 'Complete Wedding Event Management'
    },
  ];

  const eventSlideMap = {
    dj: djEventSlides,
    music: liveMusic,
    party: partyEventSlides,
    wedding: weddingEventSlides
  };

  const eventSlides = serviceMode === 'events' ? eventSlideMap[eventType] : [];
  
  const slides = serviceMode === 'photography' ? photographySlides : eventSlideMap[eventType];
  
  const photographyServices = [
    {
      icon: Heart,
      title: 'Wedding Photography',
      description: 'Capture your special day with elegance and style',
      color: 'from-red-600 to-red-700'
    },
    {
      icon: Camera,
      title: 'Event Coverage',
      description: 'Professional coverage for all your special events',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Users,
      title: 'Studio Portraits',
      description: 'Stunning portraits in our professional studio',
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: Award,
      title: 'Cinematography',
      description: 'Cinematic videos that tell your story',
      color: 'from-yellow-600 to-yellow-700'
    }
  ];

  const eventServices = [
    {
      icon: Music,
      title: 'Professional DJ Services',
      description: 'Expert DJs with state-of-the-art sound systems and lighting',
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: PartyPopper,
      title: 'Live Music & Bands',
      description: 'Professional musicians and bands for authentic entertainment',
      color: 'from-pink-600 to-pink-700'
    },
    {
      icon: Zap,
      title: 'Party Planning & Coordination',
      description: 'Complete party setup, décor, catering coordination & management',
      color: 'from-orange-600 to-orange-700'
    },
    {
      icon: Award,
      title: 'Sound & Lighting Design',
      description: 'Premium audio-visual equipment and professional setup',
      color: 'from-blue-600 to-blue-700'
    }
  ];
  
  const services = serviceMode === 'photography' ? photographyServices : eventServices;
  
  const stats = [
    { number: '500+', label: 'Happy Clients' },
    { number: '1000+', label: 'Events Covered' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Awards Won' }
  ];
  
  const photographyTestimonials = [
    {
      name: 'Sarah & Michael',
      event: 'Wedding Photography',
      rating: 5,
      text: 'Absolutely stunning work! The team captured every moment perfectly. Our wedding photos are beyond our expectations.',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop'
    },
    {
      name: 'Priya Sharma',
      event: 'Birthday Event',
      rating: 5,
      text: 'Professional, creative, and so easy to work with. The photos from my daughter\'s birthday are absolutely beautiful!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      name: 'Tech Corp Inc.',
      event: 'Corporate Event',
      rating: 5,
      text: 'Outstanding service for our annual conference. The team was professional and delivered exceptional quality.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
  ];

  const eventTestimonials = [
    {
      name: 'James & Lisa',
      event: 'Wedding DJ Entertainment',
      rating: 5,
      text: 'Our DJ kept everyone dancing all night! The energy was incredible and our guests still talk about how amazing the music selection was. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      name: 'Rajesh Gupta',
      event: 'Corporate Party',
      rating: 5,
      text: 'The DJ and party coordination team made our company event unforgettable. Perfect music, great atmosphere, and seamless coordination throughout!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    {
      name: 'Emma Wilson',
      event: 'Birthday Bash',
      rating: 5,
      text: 'Best party ever! The DJ read the crowd perfectly, the lights and sound were professional, and the whole event was managed flawlessly. Worth every penny!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    }
  ];

  const testimonials = serviceMode === 'photography' ? photographyTestimonials : eventTestimonials;
  
  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [autoPlay, slides.length]);
  // Fetch gallery photos
  useEffect(() => {
    const fetchGalleryPhotos = async () => {
      try {
        setLoadingGallery(true);
        const response = await galleryAPI.getAll();
        if (response.success && Array.isArray(response.data)) {
          // Get only photos with descriptions (featured photos)
          const featuredPhotos = response.data.filter((p: any) => p.description && p.image_url).slice(0, 12);
          setGalleryPhotos(featuredPhotos);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoadingGallery(false);
      }
    };
    
    fetchGalleryPhotos();
  }, []);  
  const nextSlide = () => {
    setAutoPlay(false);
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setAutoPlay(false);
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Service Mode Toggle - Unique Sliding Design */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black via-black/95 to-black/80 backdrop-blur-xl border-b border-yellow-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            {/* Main Toggle with Sliding Background */}
            <div className="flex items-center justify-center">
              <div className="relative inline-flex items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-1 border border-yellow-500/30 shadow-2xl">
                {/* Animated Background Indicator */}
                <motion.div
                  layout
                  layoutId="toggle-bg"
                  className="absolute inset-y-1 w-1/2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-xl shadow-lg"
                  animate={{
                    x: serviceMode === 'photography' ? 0 : '100%'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />

                {/* Photography Button */}
                <motion.button
                  onClick={() => setServiceMode('photography')}
                  className="relative px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 z-10 text-sm md:text-base group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{
                      color: serviceMode === 'photography' ? '#000' : '#9ca3af',
                    }}
                    className="transition-colors duration-300"
                  >
                    <Camera className="size-5" />
                  </motion.div>
                  <motion.span
                    animate={{
                      color: serviceMode === 'photography' ? '#000' : '#9ca3af',
                    }}
                    className="transition-colors duration-300"
                  >
                    Photography
                  </motion.span>
                </motion.button>

                {/* Event Management Button */}
                <motion.button
                  onClick={() => setServiceMode('events')}
                  className="relative px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 z-10 text-sm md:text-base group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{
                      color: serviceMode === 'events' ? '#000' : '#9ca3af',
                    }}
                    className="transition-colors duration-300"
                  >
                    <Award className="size-5" />
                  </motion.div>
                  <motion.span
                    animate={{
                      color: serviceMode === 'events' ? '#000' : '#9ca3af',
                    }}
                    className="transition-colors duration-300"
                  >
                    Event Management
                  </motion.span>
                </motion.button>
              </div>
            </div>

            {/* Event Type Selector - Animated Grid */}
            <AnimatePresence>
              {serviceMode === 'events' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-center gap-3 flex-wrap overflow-hidden"
                >
                  {/* DJ Services Button */}
                  <motion.button
                    onClick={() => setEventType('dj')}
                    layout
                    className={`relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                      eventType === 'dj'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {eventType === 'dj' && (
                      <motion.div
                        layoutId="event-bg"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-xl"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Music className="size-4" />
                      DJ Services
                    </span>
                  </motion.button>

                  {/* Live Music Button */}
                  <motion.button
                    onClick={() => setEventType('music')}
                    layout
                    className={`relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                      eventType === 'music'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {eventType === 'music' && (
                      <motion.div
                        layoutId="event-bg"
                        className="absolute inset-0 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 rounded-xl"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Music className="size-4" />
                      Live Music
                    </span>
                  </motion.button>

                  {/* Party Planning Button */}
                  <motion.button
                    onClick={() => setEventType('party')}
                    layout
                    className={`relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                      eventType === 'party'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {eventType === 'party' && (
                      <motion.div
                        layoutId="event-bg"
                        className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-xl"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <PartyPopper className="size-4" />
                      Party Planning
                    </span>
                  </motion.button>

                  {/* Weddings Button */}
                  <motion.button
                    onClick={() => setEventType('wedding')}
                    layout
                    className={`relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                      eventType === 'wedding'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {eventType === 'wedding' && (
                      <motion.div
                        layoutId="event-bg"
                        className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-xl"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Heart className="size-4" />
                      Weddings
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hero Slider Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={slides[activeSlide].image}
              alt={slides[activeSlide].title}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </motion.div>
        </AnimatePresence>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              key={`content-${activeSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
                {slides[activeSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                {slides[activeSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/client/login">
                  <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-8 py-6 h-auto font-semibold">
                    Book Now
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Link to="/packages">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 h-auto font-semibold">
                    View Packages
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronLeft className="size-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronRight className="size-6 text-white" />
        </button>
        
        {/* Slider Dots */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSlide(index);
                setAutoPlay(false);
              }}
              className={`transition-all rounded-full ${
                index === activeSlide
                  ? 'bg-yellow-500 w-12 h-3'
                  : 'bg-white/50 hover:bg-white/70 w-3 h-3'
              }`}
            />
          ))}
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#2a0f0f] via-[#3d1616] to-[#2a0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm md:text-base uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600 to-red-700 opacity-20 blur-2xl"></div>
                <ImageWithFallback
                  src={serviceMode === 'photography' ? 
                    "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=1000&fit=crop" :
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop"
                  }
                  alt={serviceMode === 'photography' ? 'Professional Photographer' : 'Event Manager'}
                  className="relative rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {serviceMode === 'photography' ? (
                <>
                  <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-6">
                    Welcome to <span className="text-white">Ambiance</span> Studio
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    For over 15 years, we've been capturing life's most precious moments with passion, creativity, and professionalism. Our award-winning team specializes in wedding photography, event coverage, studio portraits, and cinematic videography.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-8">
                    We believe every moment tells a story, and we're here to help you preserve those stories beautifully. From intimate gatherings to grand celebrations, we bring expertise, artistry, and a personal touch to every project.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-6">
                    Welcome to <span className="text-white">Ambiance</span> Events
                  </h2>
                  {eventType === 'dj' && (
                    <>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Our professional DJs bring the energy and expertise to make your event unforgettable. With state-of-the-art sound systems, lighting, and music selections tailored to your crowd, we create the perfect atmosphere for dancing and celebration.
                      </p>
                      <p className="text-gray-400 leading-relaxed mb-8">
                        From intimate gatherings to massive parties, we read the room and keep the momentum going all night long. Let us be the soundtrack to your special moment.
                      </p>
                    </>
                  )}
                  {eventType === 'music' && (
                    <>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Experience the magic of live music with our curated selection of professional musicians and bands. Whether it's a intimate acoustic performance or a full band setup, we bring authentic, high-quality entertainment to every moment.
                      </p>
                      <p className="text-gray-400 leading-relaxed mb-8">
                        Our artists understand how to create the perfect vibe for your event, engaging your guests and creating lasting memories through the power of live performance.
                      </p>
                    </>
                  )}
                  {eventType === 'party' && (
                    <>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        We specialize in planning and executing epic parties that your guests will never forget. From décor to entertainment coordination, catering logistics to sound design, we handle every detail so you can enjoy the celebration.
                      </p>
                      <p className="text-gray-400 leading-relaxed mb-8">
                        Our team brings creativity, professionalism, and passion to every party, ensuring seamless execution and maximum enjoyment for you and your guests.
                      </p>
                    </>
                  )}
                  {eventType === 'wedding' && (
                    <>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Your wedding day deserves perfection. We offer complete event management including DJ services, live music options, décor coordination, and full day-of management to ensure your celebration flows beautifully.
                      </p>
                      <p className="text-gray-400 leading-relaxed mb-8">
                        Every detail is carefully orchestrated, from the ceremony ambiance to the reception entertainment, making your wedding day as magical as you've always dreamed.
                      </p>
                    </>
                  )}
                </>
              )}
              <Link to={serviceMode === 'photography' ? '/about' : '/about'}>
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold px-8">
                  Learn More About Us
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">
              {serviceMode === 'photography' ? 'Our Photography Services' : 
                eventType === 'dj' ? 'DJ Services & Sound' :
                eventType === 'music' ? 'Live Music Entertainment' :
                eventType === 'party' ? 'Party Planning Services' :
                'Wedding Event Services'
              }
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {serviceMode === 'photography' 
                ? 'Comprehensive photography and videography solutions for every occasion'
                : eventType === 'dj' ? 'Professional DJ services with premium sound and lighting equipment'
                : eventType === 'music' ? 'Live musicians and bands for every occasion'
                : eventType === 'party' ? 'Complete party coordination and entertainment management'
                : 'Complete wedding entertainment and event coordination'
              }
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all p-6 h-full group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/packages">
              <Button variant="outline" className="border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-8">
                View All Packages
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Portfolio Preview */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">
              {serviceMode === 'photography' ? 'Our Portfolio' : 
                eventType === 'dj' ? 'DJ Events & Shows' :
                eventType === 'music' ? 'Live Music Performances' :
                eventType === 'party' ? 'Party Events' : 
                'Wedding Events'
              }
            </h2>
            <p className="text-gray-400 text-lg">
              {serviceMode === 'photography' ? 'A glimpse into our photography work' : 'Showcase of our successful events'}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {(serviceMode === 'photography' ? [
              'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop',
              'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1000&fit=crop',
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
            ] : eventType === 'dj' ? [
              'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1449985584519-ccc2606a7a53?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1487886457944-a0ee3cb37e84?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1459877286222-c37624492a13?w=800&h=600&fit=crop'
            ] : eventType === 'music' ? [
              'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1459899677411-b2a3e9fe47f4?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1487886457944-a0ee3cb37e84?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=600&fit=crop'
            ] : eventType === 'party' ? [
              'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1533995405351-cf8e61c22f29?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1519671482677-e62b29289a84?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
            ] : [
              'https://images.unsplash.com/photo-1519671482677-e62b29289a84?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1519224871644-cbbeef61bf0b?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1510578773173-62169f8d7c6a?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1511795409241-bf2ceb3b5f3b?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1505252585461-04db1267ae5b?w=800&h=600&fit=crop'
            ]).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
              >
                <ImageWithFallback
                  src={image}
                  alt={serviceMode === 'photography' ? `Portfolio ${index + 1}` : `Event ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">
              {serviceMode === 'photography' ? 'What Our Photography Clients Say' : 
                eventType === 'dj' ? 'What Our DJ Service Clients Say' :
                eventType === 'music' ? 'What Our Live Music Clients Say' :
                eventType === 'party' ? 'What Our Party Clients Say' :
                'What Our Wedding Clients Say'
              }
            </h2>
            <p className="text-gray-400 text-lg">Real experiences from real people</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-6 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.event}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="size-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-400 leading-relaxed italic">"{testimonial.text}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Gallery Showcase Section */}
      {galleryPhotos.length > 0 && (
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Recent Works</h2>
              <p className="text-xl text-gray-400">Explore our latest photography from featured events and sessions</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group rounded-lg overflow-hidden aspect-square"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.description}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Photo';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{photo.description}</h3>
                    {photo.upload_date && (
                      <p className="text-sm text-gray-300">{new Date(photo.upload_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/events/gallery">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-10 py-6 h-auto font-semibold">
                  View Full Gallery
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2a0f0f] via-[#3d1616] to-[#2a0f0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {serviceMode === 'photography' ? (
              <>
                <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-6">
                  Ready to Capture Your Moments?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Let's create something beautiful together. Book your photography session today.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-6">
                  {eventType === 'dj' ? '🎵 Ready to Get the Party Started?' :
                   eventType === 'music' ? '🎸 Ready for Live Entertainment?' :
                   eventType === 'party' ? '🎉 Ready for an Epic Party?' :
                   '💍 Ready for Your Dream Wedding?'
                  }
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  {eventType === 'dj' ? 'Book our professional DJ services and keep the energy high all night.' :
                   eventType === 'music' ? 'Reserve your live music entertainment today and create unforgettable memories.' :
                   eventType === 'party' ? 'Let us plan and execute your perfect party from start to finish.' :
                   'Let us create the perfect wedding celebration with our complete event management services.'
                  }
                </p>
              </>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/client/login">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-10 py-6 h-auto font-semibold">
                  {serviceMode === 'photography' ? 'Book Now' : 'Plan Now'}
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-10 py-6 h-auto font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-serif text-yellow-500 mb-4">Ambiance Studio</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional photography and cinematography services for all your special moments.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-yellow-500 text-sm">About Us</Link>
                <Link to="/packages" className="block text-gray-400 hover:text-yellow-500 text-sm">Packages</Link>
                <Link to="/employees" className="block text-gray-400 hover:text-yellow-500 text-sm">Our Team</Link>
                <Link to="/blog" className="block text-gray-400 hover:text-yellow-500 text-sm">Blog</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <Link to="/packages" className="block text-gray-400 hover:text-yellow-500 text-sm">Wedding Photography</Link>
                <Link to="/packages" className="block text-gray-400 hover:text-yellow-500 text-sm">Event Coverage</Link>
                <Link to="/packages" className="block text-gray-400 hover:text-yellow-500 text-sm">Studio Portraits</Link>
                <Link to="/cinematography" className="block text-gray-400 hover:text-yellow-500 text-sm">Cinematography</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>123 Photography Lane</p>
                <p>Colombo, Sri Lanka</p>
                <p>+94 77 123 4567</p>
                <p>info@ambiancestudio.lk</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Ambiance Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
