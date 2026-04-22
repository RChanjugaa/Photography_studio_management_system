import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, User, Mail, Phone, Lock, Save, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function ClientProfile() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: '+94 77 123 4567',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'client') {
      navigate('/client/login');
    }
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    localStorage.setItem('userName', formData.fullName);
    localStorage.setItem('userEmail', formData.email);
    toast.success('Profile updated successfully');
  };
  
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/client/dashboard">
          <Button variant="outline" className="mb-6 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-6 shadow-xl">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="size-16 text-gray-600" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black p-3 rounded-full cursor-pointer shadow-lg">
                    <Upload className="size-4" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
                <h3 className="font-semibold text-white">{formData.fullName}</h3>
                <p className="text-sm text-gray-400">{formData.email}</p>
              </div>
            </Card>
            
            {/* Profile Form */}
            <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-6 md:col-span-2 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
              
              <div className="space-y-5">
                <div>
                  <Label className="text-gray-300 font-medium">Full Name</Label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1.5 h-11 bg-black border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300 font-medium">Email Address</Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1.5 h-11 bg-gray-900 border-gray-700 text-gray-400"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <Label className="text-gray-300 font-medium">Phone Number</Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1.5 h-11 bg-black border-gray-700 text-white"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="text-yellow-500 hover:text-yellow-400 font-medium text-sm flex items-center gap-2"
                  >
                    <Lock className="size-4" />
                    {showChangePassword ? 'Hide' : 'Change Password'}
                  </button>
                  
                  {showChangePassword && (
                    <div className="mt-4 space-y-4">
                      <Input
                        name="currentPassword"
                        type="password"
                        placeholder="Current Password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="h-11 bg-black border-gray-700 text-white placeholder:text-gray-600"
                      />
                      <Input
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="h-11 bg-black border-gray-700 text-white placeholder:text-gray-600"
                      />
                      <Input
                        name="confirmNewPassword"
                        type="password"
                        placeholder="Confirm New Password"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className="h-11 bg-black border-gray-700 text-white placeholder:text-gray-600"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black h-11">
                    <Save className="size-4 mr-2" /> Save Changes
                  </Button>
                  <Link to="/client/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-11">Cancel</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
