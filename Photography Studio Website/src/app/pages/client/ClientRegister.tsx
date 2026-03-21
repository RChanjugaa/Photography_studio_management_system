import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function ClientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('userName', formData.fullName);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userId', 'CLT-' + Math.floor(Math.random() * 10000));
      
      toast.success('Account created successfully! Welcome to Ambiance Studio!');
      navigate('/client/dashboard');
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-500 mb-2">Create Your Account</h1>
          <p className="text-gray-400">Join Ambiance Studio and book your perfect photoshoot</p>
        </div>
        
        <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="size-12 text-gray-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black p-2 rounded-full cursor-pointer shadow-lg">
                  <Upload className="size-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Upload profile photo (optional)</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-gray-300 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="pl-11 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-300 font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="pl-11 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-gray-300 font-medium">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                  className="pl-11 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-gray-700 bg-black text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-400">
                  I agree to the <a href="#" className="text-yellow-500 hover:text-yellow-400 font-medium">Terms of Service</a> and{' '}
                  <a href="#" className="text-yellow-500 hover:text-yellow-400 font-medium">Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold text-base"
            >
              {isLoading ? (
                <>Creating account...</>
              ) : (
                <>
                  <UserPlus className="size-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/client/login" className="text-yellow-500 hover:text-yellow-400 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}