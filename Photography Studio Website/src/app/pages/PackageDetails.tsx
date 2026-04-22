import { useParams, Link } from 'react-router';
import { ArrowLeft, Check, Book, Image as ImageIcon, Clock, Users, MapPin, Package as PackageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';

const packagesData: any = {
  'wedding-gold': {
    id: 'wedding-gold',
    name: 'Wedding Gold',
    category: 'Wedding',
    price: 125000,
    duration: '6 hours',
    photographers: 2,
    description: 'Our Wedding Gold package offers comprehensive coverage of your special day with professional photographers capturing every precious moment. Perfect for couples who want high-quality photography without breaking the bank.',
    features: [
      'Candid + traditional coverage',
      '2 professional photographers',
      '500+ edited high-resolution photos',
      'Online private gallery',
      'Premium photo album (30x40cm, 60 pages)',
      'All photos on USB drive',
      'Pre-wedding consultation',
      '2 locations included'
    ],
    album: {
      size: '30cm x 40cm (12" x 16")',
      pages: 60,
      paperType: 'Premium lustre paper',
      cover: 'Genuine leather with embossing',
      layout: 'Custom professional design',
      binding: 'Layflat binding for seamless spreads',
      weight: 'Approximately 3kg'
    },
    deliverables: [
      '500+ edited photos in high resolution (6000x4000 pixels)',
      'Online gallery (password protected, 1-year hosting)',
      'USB drive with all photos in JPEG format',
      '1 premium photo album with custom design',
      '20 printed 8x10" photos on premium paper',
      'Digital backup on cloud storage',
    ],
    timeline: '4-6 weeks delivery',
    process: [
      'Initial consultation to discuss your vision',
      'Pre-wedding meeting 2 weeks before event',
      'Full day coverage on wedding day',
      'Photo editing and retouching (3-4 weeks)',
      'Online gallery delivery',
      'Album design approval',
      'Final album printing and delivery (2 weeks)'
    ]
  },
  // Add other packages similarly...
};

export default function PackageDetails() {
  const { id } = useParams();
  const pkg = packagesData[id as string];
  
  if (!pkg) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-white mb-4">Package not found</h1>
          <Link to="/packages">
            <Button className="bg-red-700 hover:bg-red-800 text-white">
              Back to Packages
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#3d1616] to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/packages" className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
            <ArrowLeft className="size-4" />
            Back to Packages
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-4">
                {pkg.category}
              </Badge>
              <h1 className="text-5xl font-serif text-yellow-500 mb-4 uppercase">{pkg.name}</h1>
              <p className="text-xl text-gray-400 mb-6">{pkg.description}</p>
              
              <div className="flex flex-wrap gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-yellow-500" />
                  <span>{pkg.duration} coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-yellow-500" />
                  <span>{pkg.photographers} photographer{pkg.photographers > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 mb-2">Package Price</div>
                  <div className="text-4xl font-bold text-yellow-500 mb-4">
                    LKR {pkg.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Delivery: {pkg.timeline}</div>
                </div>
                
                <div className="space-y-3">
                  <Link to="/client/login">
                    <Button className="w-full bg-red-700 hover:bg-red-800 text-white py-6 text-base">
                      Book This Package
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full border-2 border-gray-700 text-gray-300 hover:bg-gray-800 py-6">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Package Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-yellow-500 mb-6 uppercase">What's Included</h2>
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
                <ul className="grid md:grid-cols-2 gap-4">
                  {pkg.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            
            {/* Album Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-yellow-500 mb-6 uppercase">
                <Book className="inline size-8 mr-2 mb-1" />
                Album Specifications
              </h2>
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Album Size</div>
                    <div className="text-lg text-white font-semibold">{pkg.album.size}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Number of Pages</div>
                    <div className="text-lg text-white font-semibold">{pkg.album.pages} pages</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Paper Type</div>
                    <div className="text-lg text-white font-semibold">{pkg.album.paperType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Cover Material</div>
                    <div className="text-lg text-white font-semibold">{pkg.album.cover}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Layout Design</div>
                    <div className="text-lg text-white font-semibold">{pkg.album.layout}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Binding Type</div>
                    <div className="text-lg text-white font-semibold">{pkg.album.binding}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Deliverables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-yellow-500 mb-6 uppercase">
                <PackageIcon className="inline size-8 mr-2 mb-1" />
                What You'll Receive
              </h2>
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
                <ul className="space-y-4">
                  {pkg.deliverables.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                      <ImageIcon className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            
            {/* Process Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-yellow-500 mb-6 uppercase">Our Process</h2>
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
                <div className="space-y-6">
                  {pkg.process.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center text-yellow-500 font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-300">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h3 className="text-xl font-serif text-yellow-500 mb-4 uppercase">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-white">{pkg.duration}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Team</div>
                    <div className="text-white">{pkg.photographers} Professional Photographer{pkg.photographers > 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PackageIcon className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Delivery</div>
                    <div className="text-white">{pkg.timeline}</div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Need Help */}
            <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-transparent p-6">
              <h3 className="text-xl font-serif text-yellow-500 mb-3">Need Help Choosing?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Our team is here to help you select the perfect package for your needs.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                  Contact Us
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
