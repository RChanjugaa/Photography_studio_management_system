import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Briefcase, Calendar, DollarSign, Upload, Plus, Eye, EyeOff, Save, Trash2, Camera } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import StaffNavigation from '../../components/StaffNavigation';

export default function StaffSelfService() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Check staff authentication
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'staff' && userRole !== 'admin') {
      toast.error('Access denied. Staff login required.');
      navigate('/staff/login');
    }
  }, [navigate]);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: 'Amaya',
    lastName: 'Silva',
    role: 'Lead Photographer',
    email: 'amaya@ambiance.lk',
    phone: '+94 77 123 4567',
    bio: 'Passionate wedding and portrait photographer with 8+ years of experience.',
    specialties: ['Weddings', 'Portraits', 'Studio'],
    joinDate: '2016-03-15'
  });
  
  // Portfolio State
  const [portfolio, setPortfolio] = useState([
    { id: 1, title: 'Beach Wedding', description: 'Beautiful sunset ceremony', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&h=1080&fit=crop', visibility: 'public' },
    { id: 2, title: 'Garden Ceremony', description: 'Romantic garden setting', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1080&h=1080&fit=crop', visibility: 'public' },
    { id: 3, title: 'Studio Portrait', description: 'Professional headshot session', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1080&h=1080&fit=crop', visibility: 'private' }
  ]);
  
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    url: '',
    visibility: 'public'
  });
  
  // Assignments State
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Silva-Perera Wedding', date: '2024-03-25', time: '14:00', location: 'Galle Face Hotel', status: 'upcoming', priority: 'high' },
    { id: 2, title: 'Corporate Event - Dialog', date: '2024-03-28', time: '09:00', location: 'BMICH Colombo', status: 'upcoming', priority: 'medium' },
    { id: 3, title: 'Family Portrait Session', date: '2024-03-20', time: '16:00', location: 'Viharamahadevi Park', status: 'completed', priority: 'low' }
  ]);
  
  // Salary State
  const [salaryData, setSalaryData] = useState({
    baseSalary: 120000,
    allowances: 25000,
    deductions: 8000,
    netSalary: 137000,
    currency: 'LKR',
    payCycle: 'Monthly',
    lastPayment: '2024-02-28',
    payslips: [
      { id: 1, month: 'February 2024', amount: 137000, date: '2024-02-28', pdfUrl: '#' },
      { id: 2, month: 'January 2024', amount: 137000, date: '2024-01-31', pdfUrl: '#' },
      { id: 3, month: 'December 2023', amount: 135000, date: '2023-12-29', pdfUrl: '#' }
    ]
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setLoading(false);
    }, 1000);
  };
  
  const handleAddPortfolioItem = () => {
    if (!newPortfolioItem.title || !newPortfolioItem.url) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newItem = {
      id: portfolio.length + 1,
      ...newPortfolioItem
    };
    
    setPortfolio([...portfolio, newItem]);
    setNewPortfolioItem({ title: '', description: '', url: '', visibility: 'public' });
    toast.success('Portfolio item added');
  };
  
  const handleDeletePortfolioItem = (id: number) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
    toast.success('Portfolio item deleted');
  };
  
  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'assignments', label: 'My Assignments', icon: Calendar },
    { id: 'salary', label: 'My Salary', icon: DollarSign }
  ];
  
  return (
    <>
      <StaffNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Staff Portal</h1>
            <p className="text-gray-400">Manage your profile, portfolio, and view your assignments</p>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-700 text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <tab.icon className="size-5" />
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div>
                  <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                          <User className="size-16 text-gray-600" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-red-700 hover:bg-red-800 p-2 rounded-full text-white transition-colors">
                          <Camera className="size-4" />
                        </button>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <p className="text-sm text-yellow-500 mb-2">{profileData.role}</p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(profileData.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="role" className="text-gray-300">Role (Read Only)</Label>
                        <Input
                          id="role"
                          value={profileData.role}
                          disabled
                          className="mt-1.5 bg-gray-800 border-gray-700 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Role is set by admin</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email" className="text-gray-300">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          rows={4}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-gray-300">Specialties</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.specialties.map((specialty) => (
                            <Badge key={specialty} className="bg-red-900/30 text-red-300 border border-red-800">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-red-700 hover:bg-red-800 text-white"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                          <Save className="ml-2 size-4" />
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Add New Item */}
                <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
                  <h3 className="text-xl font-serif text-yellow-500 mb-4 uppercase">Add Portfolio Item</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Title"
                      value={newPortfolioItem.title}
                      onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                    <Input
                      placeholder="Image URL"
                      value={newPortfolioItem.url}
                      onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, url: e.target.value })}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                    <Input
                      placeholder="Description"
                      value={newPortfolioItem.description}
                      onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                    <select
                      value={newPortfolioItem.visibility}
                      onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, visibility: e.target.value })}
                      className="bg-gray-900 border border-gray-800 text-white rounded-md px-3 py-2"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleAddPortfolioItem}
                    className="mt-4 bg-red-700 hover:bg-red-800 text-white"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Item
                  </Button>
                </Card>
                
                {/* Portfolio Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item) => (
                    <Card key={item.id} className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-semibold">{item.title}</h4>
                          <Badge className={item.visibility === 'public' ? 'bg-green-900/30 text-green-300 border-green-800' : 'bg-gray-800 text-gray-400'}>
                            {item.visibility === 'public' ? <Eye className="size-3 mr-1" /> : <EyeOff className="size-3 mr-1" />}
                            {item.visibility}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePortfolioItem(item.id)}
                          className="border-red-800 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="size-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
                <h3 className="text-xl font-serif text-yellow-500 mb-6 uppercase">My Assignments</h3>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-grow">
                          <h4 className="text-white font-semibold mb-2">{assignment.title}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              {assignment.date} at {assignment.time}
                            </span>
                            <span>{assignment.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={
                            assignment.priority === 'high' ? 'bg-red-900/30 text-red-300 border-red-800' :
                            assignment.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' :
                            'bg-gray-800 text-gray-400'
                          }>
                            {assignment.priority}
                          </Badge>
                          <Badge className={
                            assignment.status === 'completed' ? 'bg-green-900/30 text-green-300 border-green-800' :
                            'bg-blue-900/30 text-blue-300 border-blue-800'
                          }>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Salary Tab */}
            {activeTab === 'salary' && (
              <div className="space-y-6">
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6">
                  <p className="text-yellow-300 text-sm flex items-center gap-2">
                    <DollarSign className="size-4" />
                    Salary details are private to you and the owner.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Salary Breakdown */}
                  <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
                    <h3 className="text-xl font-serif text-yellow-500 mb-6 uppercase">Salary Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-gray-800">
                        <span className="text-gray-400">Base Salary</span>
                        <span className="text-white font-semibold">{salaryData.currency} {salaryData.baseSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-800">
                        <span className="text-gray-400">Allowances</span>
                        <span className="text-green-400 font-semibold">+ {salaryData.currency} {salaryData.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-800">
                        <span className="text-gray-400">Deductions</span>
                        <span className="text-red-400 font-semibold">- {salaryData.currency} {salaryData.deductions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-4 bg-gray-900 rounded-lg px-4">
                        <span className="text-yellow-500 font-semibold">Net Salary</span>
                        <span className="text-yellow-500 font-bold text-xl">{salaryData.currency} {salaryData.netSalary.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-500 text-sm">Pay Cycle: {salaryData.payCycle}</p>
                    </div>
                  </Card>
                  
                  {/* Payslips */}
                  <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
                    <h3 className="text-xl font-serif text-yellow-500 mb-6 uppercase">Payslips</h3>
                    <div className="space-y-3">
                      {salaryData.payslips.map((slip) => (
                        <div
                          key={slip.id}
                          className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-700 transition-colors"
                        >
                          <div>
                            <h4 className="text-white font-semibold">{slip.month}</h4>
                            <p className="text-gray-400 text-sm">{salaryData.currency} {slip.amount.toLocaleString()}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Download PDF
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}