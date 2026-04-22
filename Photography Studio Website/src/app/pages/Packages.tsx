import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Check, Heart, Camera, Users, Video, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { packagesAPI } from '../../services/api';

export default function Packages() {

const [selectedCategory, setSelectedCategory] = useState('all');
const [dbPackages, setDbPackages] = useState<any[]>([]);
const [loadingPkgs, setLoadingPkgs] = useState(true);

useEffect(() => {
  const fetchPkgs = async () => {
    try {
      const res = await packagesAPI.getActive();
      if (res.success && res.data.length > 0) {
        setDbPackages(res.data);
      }
    } catch (e) {
      console.error('Failed to load packages');
    } finally {
      setLoadingPkgs(false);
    }
  };
  fetchPkgs();
}, []);

  
  
                        const displayPackages = dbPackages.length > 0 ? dbPackages.map(p => ({
                  id: p.id,
                  category: p.type.toLowerCase(),
                  name: p.title,
                  price: parseFloat(p.base_price),
                  duration: p.duration_hours ? `${p.duration_hours} Hours` : 'Custom',
                  featured: false,
                  icon: Heart,
                  color: 'from-yellow-600 to-yellow-500',
                  features: p.description ? p.description.split(',').map((f: string) => f.trim()) : ['Professional coverage', 'Edited photos', 'Digital delivery']
                })) : packages;

                const filteredPackages = selectedCategory === 'all'
                  ? displayPackages
                  : displayPackages.filter(pkg => pkg.category === selectedCategory);
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#2a0f0f] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif text-yellow-500 mb-6">Our Packages</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose from our carefully crafted packages designed to capture your special moments perfectly. 
              All packages can be customized to meet your specific needs.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-black/95 backdrop-blur-sm border-y border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black'
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Packages Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br from-[#2a0f0f] to-black border-2 ${
                  pkg.featured ? 'border-yellow-500 shadow-2xl shadow-yellow-500/20' : 'border-gray-800'
                } hover:border-yellow-500/50 transition-all h-full flex flex-col relative overflow-hidden group`}>
                  {pkg.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold border-0">
                        <Star className="size-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  {/* Package Header */}
                  <div className="p-6 border-b border-gray-800">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <pkg.icon className="size-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">{pkg.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{pkg.duration}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-yellow-500">
                        LKR {(pkg.price / 1000).toFixed(0)}k
                      </span>
                      <span className="text-gray-500">starting</span>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <div className="p-6 flex-1">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <Check className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="p-6 pt-0">
                    <Link to="/client/login">
                      <Button className={`w-full ${
                        pkg.featured
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black'
                          : 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-800'
                      } font-semibold`}>
                        Book This Package
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No packages found in this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Custom Package Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-yellow-500/30 p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mx-auto mb-6">
                <Camera className="size-10 text-black" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-yellow-500 mb-4">
                Need a Custom Package?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Every event is unique. We offer fully customizable packages tailored to your specific needs, 
                budget, and vision. Let's create something perfect for you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black text-lg px-8 py-6 h-auto font-semibold">
                    Request Custom Quote
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Link to="/client/login">
                  <Button variant="outline" className="border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-lg px-8 py-6 h-auto font-semibold">
                    Book a Consultation
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>
      
      {/* Add-ons Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif text-yellow-500 mb-4">Popular Add-ons</h2>
            <p className="text-gray-400 text-lg">Enhance your package with these extras</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Extra Hour', price: 15000 },
              { name: 'Drone Coverage', price: 25000 },
              { name: 'Photo Booth', price: 35000 },
              { name: 'Same-Day Edit', price: 45000 },
              { name: 'Additional Album', price: 30000 },
              { name: 'Makeup Artist', price: 20000 },
              { name: 'Extra Photographer', price: 40000 },
              { name: 'Rush Delivery', price: 15000 }
            ].map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all p-6 text-center">
                  <h3 className="text-white font-semibold mb-2">{addon.name}</h3>
                  <p className="text-yellow-500 text-lg font-bold">+LKR {addon.price.toLocaleString()}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif text-yellow-500 mb-4">Frequently Asked Questions</h2>
          </motion.div>
          
          <div className="space-y-4">
            {[
              {
                q: 'What is included in all packages?',
                a: 'All packages include professional photography/videography, basic editing, online gallery access, and digital file delivery.'
              },
              {
                q: 'How long does it take to receive photos?',
                a: 'Typically 2-3 weeks for weddings, 1-2 weeks for events, and 3-5 days for studio sessions. Rush delivery available for additional fee.'
              },
              {
                q: 'Can I customize a package?',
                a: 'Absolutely! We can mix and match features from different packages or create a completely custom solution for your needs.'
              },
              {
                q: 'What is your cancellation policy?',
                a: 'Deposits are non-refundable. Full refunds available if cancelled 60+ days before event. Partial refunds for 30-60 days notice.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
