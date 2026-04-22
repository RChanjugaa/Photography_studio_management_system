import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Filter, User, Camera, Award } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { motion } from 'motion/react';

// Mock data - will be replaced with API calls
const mockEmployees = [
  {
    id: 1,
    firstName: 'Amaya',
    lastName: 'Silva',
    role: 'Lead Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Specialized in wedding and portrait photography with 8+ years of experience capturing life\'s most precious moments.',
    specialties: ['Weddings', 'Portraits', 'Studio'],
    yearsExperience: 8,
    rating: 4.9,
    visiblePublic: true
  },
  {
    id: 2,
    firstName: 'Kasun',
    lastName: 'Perera',
    role: 'Cinematographer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Award-winning cinematographer creating cinematic wedding films and corporate videos with artistic storytelling.',
    specialties: ['Cinematography', 'Weddings', 'Events'],
    yearsExperience: 6,
    rating: 4.8,
    visiblePublic: true
  },
  {
    id: 3,
    firstName: 'Nadeeka',
    lastName: 'Fernando',
    role: 'Photo Editor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Expert photo editor and retoucher bringing images to life with meticulous attention to detail and creative vision.',
    specialties: ['Editing', 'Retouching', 'Color Grading'],
    yearsExperience: 5,
    rating: 4.9,
    visiblePublic: true
  },
  {
    id: 4,
    firstName: 'Dinesh',
    lastName: 'Jayawardena',
    role: 'Event Photographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Dynamic event photographer capturing the energy and emotions of corporate events, concerts, and celebrations.',
    specialties: ['Events', 'Corporate', 'Concerts'],
    yearsExperience: 4,
    rating: 4.7,
    visiblePublic: true
  }
];

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('experience');
  
  useEffect(() => {
    // Filter and sort employees
    let filtered = mockEmployees.filter(emp => emp.visiblePublic);
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(emp => emp.role.toLowerCase().includes(roleFilter.toLowerCase()));
    }
    
    // Sort
    if (sortBy === 'experience') {
      filtered.sort((a, b) => b.yearsExperience - a.yearsExperience);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    setEmployees(filtered);
  }, [searchQuery, roleFilter, sortBy]);
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif text-yellow-500 mb-4 uppercase">Our Team</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the talented professionals behind Ambiance Photography. Each member brings unique expertise and passion to every project.
          </p>
        </motion.div>
        
        {/* Search and Filter Toolbar */}
        <div className="mb-8">
          <div className="grid md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search by name, role, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                />
              </div>
            </div>
            
            {/* Role Filter */}
            <div className="md:col-span-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <Filter className="size-4 mr-2" />
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="photographer">Photographers</SelectItem>
                  <SelectItem value="cinematographer">Cinematographers</SelectItem>
                  <SelectItem value="editor">Editors</SelectItem>
                  <SelectItem value="assistant">Assistants</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort */}
            <div className="md:col-span-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Employee Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/employees/${employee.id}`}>
                <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black hover:border-yellow-500 transition-all duration-300 overflow-hidden group">
                  {/* Avatar */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={employee.avatar}
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Award className="size-4" />
                      {employee.rating}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    {/* Name & Role */}
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-yellow-500 text-sm mb-3">{employee.role}</p>
                    
                    {/* Bio */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {employee.bio}
                    </p>
                    
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {employee.specialties.slice(0, 3).map((specialty) => (
                        <Badge
                          key={specialty}
                          className="bg-red-900/30 text-red-300 border border-red-800 text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Experience */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <Camera className="size-4" />
                      <span>{employee.yearsExperience}+ years experience</span>
                    </div>
                    
                    {/* CTA */}
                    <Button
                      variant="outline"
                      className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Empty State */}
        {employees.length === 0 && (
          <div className="text-center py-20">
            <User className="size-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No team members found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
