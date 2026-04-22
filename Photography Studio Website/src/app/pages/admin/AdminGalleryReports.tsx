import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, TrendingUp, Star, Download, Image as ImageIcon, Users, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import AdminNavigation from '../../components/AdminNavigation';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const deliveryRateData = [
  { month: 'Jan', delivered: 12, pending: 3 },
  { month: 'Feb', delivered: 15, pending: 2 },
  { month: 'Mar', delivered: 8, pending: 4 },
];

const ratingDistribution = [
  { rating: '5 Stars', count: 12, value: 60 },
  { rating: '4 Stars', count: 5, value: 25 },
  { rating: '3 Stars', count: 2, value: 10 },
  { rating: '2 Stars', count: 1, value: 5 },
];

const topTags = [
  { tag: 'Professional', count: 18 },
  { tag: 'Creative', count: 15 },
  { tag: 'On Time', count: 14 },
  { tag: 'Friendly', count: 12 },
  { tag: 'High Quality', count: 10 },
];

const downloadsByGallery = [
  { gallery: 'Silva Wedding', downloads: 156, photos: 124 },
  { gallery: 'Fernando Birthday', downloads: 87, photos: 87 },
  { gallery: 'Perera Corporate', downloads: 203, photos: 156 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#dc2626'];

export default function AdminGalleryReports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const stats = [
    { 
      label: 'Total Galleries', 
      value: '24', 
      change: '+4 this month',
      icon: ImageIcon, 
      color: 'text-blue-400', 
      bg: 'bg-blue-900/30', 
      border: 'border-blue-800',
    },
    { 
      label: 'Delivered Galleries', 
      value: '20', 
      change: '83% rate',
      icon: TrendingUp, 
      color: 'text-green-400', 
      bg: 'bg-green-900/30', 
      border: 'border-green-800',
    },
    { 
      label: 'Average Rating', 
      value: '4.8', 
      change: '+0.2 vs last month',
      icon: Star, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-900/30', 
      border: 'border-yellow-800',
    },
    { 
      label: 'Total Downloads', 
      value: '1,247', 
      change: '+156 this week',
      icon: Download, 
      color: 'text-purple-400', 
      bg: 'bg-purple-900/30', 
      border: 'border-purple-800',
    },
  ];
  
  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/gallery">
                <Button variant="outline" className="mb-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Galleries
                </Button>
              </Link>
              <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Gallery Insights</h1>
              <p className="text-gray-400">Photo delivery and client satisfaction analytics</p>
            </div>
            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => toast.success('Exporting gallery report...')}
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${stat.border} ${stat.bg} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <stat.icon className={`size-10 ${stat.color}`} />
                    <span className={`text-sm font-semibold ${stat.color}`}>{stat.change}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Delivery Rate Chart */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h3 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Gallery Delivery Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deliveryRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Rating Distribution Chart */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h3 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Rating Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ rating, value }) => `${rating}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
          
          {/* Top Tags */}
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6 mb-8">
            <h3 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Top Feedback Tags</h3>
            <div className="space-y-4">
              {topTags.map((tag, index) => {
                const maxCount = Math.max(...topTags.map(t => t.count));
                const percentage = (tag.count / maxCount) * 100;
                
                return (
                  <div key={tag.tag}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{tag.tag}</span>
                      <span className="text-gray-400 text-sm">{tag.count} mentions</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-red-700 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Downloads by Gallery */}
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-2xl font-serif text-yellow-500 uppercase">Downloads by Gallery</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Gallery</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Photos</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Downloads</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Avg per Photo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {downloadsByGallery.map((gallery) => {
                    const avgPerPhoto = (gallery.downloads / gallery.photos).toFixed(1);
                    
                    return (
                      <tr key={gallery.gallery} className="hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">{gallery.gallery}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400">{gallery.photos}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-semibold">{gallery.downloads}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-blue-900/30 text-blue-300 border-blue-800">
                            {avgPerPhoto}x
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
