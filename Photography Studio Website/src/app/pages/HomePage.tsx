import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, Camera, Award, Users, Heart, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  const slides = [
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
  
  const services = [
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
  
  const stats = [
    { number: '500+', label: 'Happy Clients' },
    { number: '1000+', label: 'Events Covered' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Awards Won' }
  ];
  
  const testimonials = [
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
  
  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [autoPlay, slides.length]);
  
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
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=1000&fit=crop"
                  alt="Professional Photographer"
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
              <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-6">
                Welcome to <span className="text-white">Ambiance</span> Studio
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                For over 15 years, we've been capturing life's most precious moments with passion, creativity, and professionalism. Our award-winning team specializes in wedding photography, event coverage, studio portraits, and cinematic videography.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                We believe every moment tells a story, and we're here to help you preserve those stories beautifully. From intimate gatherings to grand celebrations, we bring expertise, artistry, and a personal touch to every project.
              </p>
              <Link to="/about">
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
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive photography and videography solutions for every occasion
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
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Our Work</h2>
            <p className="text-gray-400 text-lg">A glimpse into our portfolio</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop',
              'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1000&fit=crop',
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
            ].map((image, index) => (
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
                  alt={`Portfolio ${index + 1}`}
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
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">What Our Clients Say</h2>
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
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2a0f0f] via-[#3d1616] to-[#2a0f0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-6">
              Ready to Capture Your Moments?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create something beautiful together. Book your session today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/client/login">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-10 py-6 h-auto font-semibold">
                  Book Now
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
