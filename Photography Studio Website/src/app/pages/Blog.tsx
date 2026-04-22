import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'motion/react';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'wedding', name: 'Wedding Tips' },
    { id: 'photography', name: 'Photography' },
    { id: 'video', name: 'Videography' },
    { id: 'trends', name: 'Trends' },
    { id: 'behind-scenes', name: 'Behind the Scenes' }
  ];
  
  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Perfect Wedding Photography',
      excerpt: 'Planning your wedding photos? Here are essential tips to ensure your big day is captured beautifully...',
      category: 'wedding',
      author: 'Amara Silva',
      date: 'March 15, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: 'The Art of Candid Photography',
      excerpt: 'Discover how to capture authentic moments and genuine emotions through candid photography techniques...',
      category: 'photography',
      author: 'Kasun Fernando',
      date: 'March 10, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
      featured: false
    },
    {
      id: 3,
      title: '2026 Wedding Photography Trends',
      excerpt: 'Stay ahead with the latest wedding photography trends including drone shots, film photography revival...',
      category: 'trends',
      author: 'Priya Jayawardena',
      date: 'March 5, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
      featured: true
    },
    {
      id: 4,
      title: 'Choosing the Right Photography Package',
      excerpt: 'A comprehensive guide to selecting the perfect photography package for your event and budget...',
      category: 'wedding',
      author: 'David Park',
      date: 'February 28, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      featured: false
    },
    {
      id: 5,
      title: 'Behind the Lens: A Day in Our Studio',
      excerpt: 'Take a peek behind the curtain and see what goes into creating stunning photography at Ambiance...',
      category: 'behind-scenes',
      author: 'Amara Silva',
      date: 'February 20, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop',
      featured: false
    },
    {
      id: 6,
      title: 'Cinematic Wedding Videos: A Complete Guide',
      excerpt: 'Everything you need to know about creating cinematic wedding films that tell your love story...',
      category: 'video',
      author: 'Priya Jayawardena',
      date: 'February 15, 2026',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
      featured: false
    },
    {
      id: 7,
      title: 'Lighting Techniques for Indoor Events',
      excerpt: 'Master the art of indoor event photography with these professional lighting tips and tricks...',
      category: 'photography',
      author: 'Kasun Fernando',
      date: 'February 10, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
      featured: false
    },
    {
      id: 8,
      title: 'Pre-Wedding Photoshoot Ideas for 2026',
      excerpt: 'Get inspired with these creative pre-wedding photoshoot locations and concepts in Sri Lanka...',
      category: 'wedding',
      author: 'David Park',
      date: 'February 5, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop',
      featured: false
    },
    {
      id: 9,
      title: 'The Rise of Drone Photography in Weddings',
      excerpt: 'Aerial photography is transforming wedding coverage. Learn why drone footage is a must-have...',
      category: 'trends',
      author: 'Priya Jayawardena',
      date: 'January 28, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop',
      featured: false
    }
  ];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const featuredPost = blogPosts.find(post => post.featured);
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#2a0f0f] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif text-yellow-500 mb-6">Our Blog</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tips, trends, and inspiration from the world of photography and cinematography
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-yellow-500/50 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <ImageWithFallback
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold border-0">
                      Featured Post
                    </Badge>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <Badge className="w-fit bg-gray-900 text-yellow-500 border border-gray-800 mb-4">
                      <Tag className="size-3 mr-1" />
                      {categories.find(c => c.id === featuredPost.category)?.name}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <span>• {featuredPost.readTime}</span>
                    </div>
                    <Link to={`/blog/${featuredPost.id}`}>
                      <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                        Read Full Article
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Search & Filter */}
      <section className="sticky top-16 z-40 bg-black/95 backdrop-blur-sm border-y border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
        </div>
      </section>
      
      {/* Blog Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.id}`}>
                    <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all overflow-hidden h-full flex flex-col group">
                      <div className="relative overflow-hidden">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <Badge className="w-fit bg-gray-900 text-yellow-500 border border-gray-800 mb-3">
                          <Tag className="size-3 mr-1" />
                          {categories.find(c => c.id === post.category)?.name}
                        </Badge>
                        
                        <h3 className="text-xl font-semibold text-white mb-3 leading-tight group-hover:text-yellow-500 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500 pt-4 border-t border-gray-800">
                          <div className="flex items-center gap-1">
                            <User className="size-3" />
                            <span>{post.author}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-yellow-500/30 p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-yellow-500 mb-4">
                Never Miss a Post
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest photography tips, trends, and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 flex-1"
                />
                <Button className="h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold px-8">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>
    </div>
  );
}
