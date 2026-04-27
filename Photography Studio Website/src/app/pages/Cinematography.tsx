import { Link } from 'react-router';
import { Video, Film, Camera, Play, Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'motion/react';

export default function Cinematography() {
  const services = [
    {
      icon: Video,
      title: 'Wedding Films',
      description: 'Cinematic wedding videos that capture the emotion and beauty of your special day',
      features: ['Full ceremony coverage', 'Reception highlights', 'Pre-wedding film', 'Drone footage'],
      color: 'from-red-600 to-red-700'
    },
    {
      icon: Film,
      title: 'Event Videography',
      description: 'Professional video coverage for corporate events, conferences, and celebrations',
      features: ['Multi-camera setup', 'Live streaming', 'Highlight reels', 'Interview segments'],
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Camera,
      title: 'Commercial Videos',
      description: 'High-quality promotional videos for businesses and brands',
      features: ['Product videos', 'Brand stories', 'Social media content', 'Corporate profiles'],
      color: 'from-purple-600 to-purple-700'
    }
  ];
  
  const packages = [
    {
      name: 'Wedding Cinematic Package',
      price: 150000,
      duration: 'Full Day',
      features: [
        'Full day coverage (12 hours)',
        '2 professional videographers',
        'Cinematic highlight film (10-15 min)',
        'Full ceremony edit',
        'Drone footage',
        '4K video quality',
        'Custom music selection',
        'Color grading & effects',
        'Blu-ray + digital files',
        '3-4 weeks delivery'
      ]
    },
    {
      name: 'Event Highlight Package',
      price: 65000,
      duration: '4 Hours',
      features: [
        '4 hour coverage',
        'Professional videographer',
        'Highlight reel (3-5 min)',
        'Social media edits',
        '1080p HD quality',
        'Background music',
        'Color grading',
        'Digital files',
        '5-7 days delivery'
      ]
    },
    {
      name: 'Commercial Video Package',
      price: 95000,
      duration: 'Per Project',
      features: [
        '1-2 days production',
        'Scriptwriting assistance',
        'Professional equipment',
        '2-3 minute final video',
        '4K quality',
        'Motion graphics',
        'Voiceover options',
        'Unlimited revisions',
        '2 weeks delivery'
      ]
    }
  ];
  
  const portfolio = [
    {
      title: 'Sarah & Michael\'s Wedding',
      category: 'Wedding Film',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      duration: '12:45'
    },
    {
      title: 'Tech Conference 2026',
      category: 'Corporate Event',
      thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      duration: '4:30'
    },
    {
      title: 'Paradise Resort Promo',
      category: 'Commercial',
      thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
      duration: '2:15'
    },
    {
      title: 'Priya\'s Birthday Celebration',
      category: 'Event Highlight',
      thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      duration: '5:20'
    }
  ];
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1920&h=1080&fit=crop"
          alt="Cinematography"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl font-serif text-yellow-500 mb-6 leading-tight">
                Cinematic Storytelling
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                We don't just record moments – we create films that move hearts and tell unforgettable stories.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/client/login">
                  <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-8 py-6 h-auto font-semibold">
                    Book a Video Session
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black text-lg px-8 py-6 h-auto font-semibold">
                  <Play className="mr-2 size-5" />
                  Watch Our Work
                </Button>
              </div>
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
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Our Video Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional videography and film production for every occasion
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all p-8 h-full group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <Check className="size-4 text-yellow-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Our Cinematography */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif text-yellow-500 mb-6">Why Choose Our Cinematography?</h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Cinematic Quality',
                    description: '4K resolution, professional color grading, and Hollywood-style editing'
                  },
                  {
                    title: 'Experienced Team',
                    description: 'Award-winning videographers and editors with 15+ years of experience'
                  },
                  {
                    title: 'Latest Equipment',
                    description: 'State-of-the-art cameras, drones, gimbals, and audio equipment'
                  },
                  {
                    title: 'Storytelling Focus',
                    description: 'We craft narratives that capture emotions and create lasting memories'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center">
                      <Check className="size-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600 to-red-700 opacity-20 blur-2xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=1000&fit=crop"
                alt="Cinematographer at work"
                className="relative rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Video Packages */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Video Packages</h2>
            <p className="text-gray-400 text-lg">Professional video solutions for every need</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all h-full flex flex-col">
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-2xl font-serif text-white mb-2">{pkg.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{pkg.duration}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-yellow-500">
                        LKR {(pkg.price / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <Check className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-6 pt-0">
                    <Link to="/client/login">
                      <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 border border-gray-800 font-semibold">
                        Book This Package
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Our Video Portfolio</h2>
            <p className="text-gray-400 text-lg">See our cinematic work in action</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {portfolio.map((video, index) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all overflow-hidden group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="size-8 text-black ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-semibold">{video.duration}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{video.title}</h3>
                    <p className="text-yellow-500 text-sm">{video.category}</p>
                  </div>
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
              Ready to Tell Your Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create a cinematic masterpiece together. Book your video session today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/client/login">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-10 py-6 h-auto font-semibold">
                  Book Now
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black text-lg px-10 py-6 h-auto font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}