import { Link } from 'react-router';
import { Camera, Award, Heart, Users, Target, Eye, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'motion/react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'We pour our heart into every shot, treating each project as a unique story waiting to be told.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Our commitment to quality has earned us numerous awards and the trust of hundreds of clients.'
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Your vision is our mission. We listen, understand, and deliver beyond expectations.'
    },
    {
      icon: Camera,
      title: 'Creativity',
      description: 'Innovation and artistry drive us to create unique, memorable images that stand out.'
    }
  ];
  
  const team = [
    {
      name: 'Amara Silva',
      role: 'Founder & Lead Photographer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: '15+ years of experience capturing life\'s precious moments'
    },
    {
      name: 'Kasun Fernando',
      role: 'Senior Wedding Photographer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Specialized in wedding and engagement photography'
    },
    {
      name: 'Priya Jayawardena',
      role: 'Cinematographer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Award-winning filmmaker and video production specialist'
    },
    {
      name: 'David Park',
      role: 'Portrait Specialist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Expert in studio portraits and commercial photography'
    }
  ];
  
  const milestones = [
    { year: '2010', event: 'Ambiance Studio Founded' },
    { year: '2013', event: 'Won Best Wedding Photography Award' },
    { year: '2016', event: 'Expanded to Cinematography Services' },
    { year: '2019', event: 'Reached 500+ Happy Clients' },
    { year: '2022', event: 'Opened Second Studio Location' },
    { year: '2026', event: 'Celebrating 15+ Years of Excellence' }
  ];
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&h=1080&fit=crop"
          alt="About Ambiance Studio"
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
              <h1 className="text-5xl md:text-6xl font-serif text-yellow-500 mb-6">About Ambiance Studio</h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Where art meets passion, and moments become timeless memories. We're more than photographers – we're storytellers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif text-yellow-500 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Ambiance Studio was born from a simple belief: every moment deserves to be captured beautifully. What started as a one-person passion project in 2010 has grown into a full-service photography and cinematography studio with a team of talented professionals.
                </p>
                <p>
                  Over the past 15+ years, we've had the privilege of documenting thousands of weddings, events, and special occasions. Each project teaches us something new, and we bring that experience to every shoot.
                </p>
                <p>
                  Today, Ambiance Studio is recognized as one of Sri Lanka's premier photography studios, known for our artistic vision, technical excellence, and unwavering commitment to our clients.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=500&fit=crop"
                alt="Studio 1"
                className="rounded-lg shadow-xl"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=500&fit=crop"
                alt="Studio 2"
                className="rounded-lg shadow-xl mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-[#2a0f0f] via-[#3d1616] to-[#2a0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-black to-[#2a0f0f] border-2 border-gray-800 p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-2xl flex items-center justify-center">
                    <Target className="size-8 text-black" />
                  </div>
                  <h3 className="text-3xl font-serif text-yellow-500">Our Mission</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To capture life's most precious moments with artistry, professionalism, and passion. We strive to create timeless images that tell your unique story and preserve memories for generations to come.
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-black to-[#2a0f0f] border-2 border-gray-800 p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                    <Eye className="size-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-serif text-yellow-500">Our Vision</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To be the most trusted and sought-after photography studio, known for exceptional quality, innovative creativity, and unforgettable client experiences. We aim to set new standards in visual storytelling.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Our Core Values</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all p-6 h-full text-center group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="size-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Journey Timeline */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Our Journey</h2>
            <p className="text-gray-400 text-lg">Milestones that shaped our story</p>
          </motion.div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-6"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-2xl font-bold text-yellow-500">{milestone.year}</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 border-4 border-black shadow-lg"></div>
                </div>
                <Card className="flex-1 bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-4">
                  <p className="text-white font-medium">{milestone.event}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Meet the Team */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-yellow-500 mb-4">Meet Our Team</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Talented professionals dedicated to capturing your perfect moments
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-yellow-500 text-sm mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/employees">
              <Button variant="outline" className="border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-8">
                View Full Team
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
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
              Let's Create Magic Together
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to turn your moments into timeless memories? Get in touch with us today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/client/login">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-10 py-6 h-auto font-semibold">
                  Book a Session
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
    </div>
  );
}
