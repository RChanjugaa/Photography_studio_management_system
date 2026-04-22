import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function StaffLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login - in production, this would call the API
    setTimeout(() => {
      toast.success('Staff login successful!');
      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'staff');
      localStorage.setItem('userName', 'Amaya Silva');
      localStorage.setItem('userEmail', formData.email);
      
      navigate('/staff/me');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-black">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-red-700 p-4 rounded-2xl">
                  <Briefcase className="size-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-serif text-yellow-500 mb-2 uppercase">Staff Portal</h1>
              <p className="text-gray-400">Sign in to access your workspace</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@ambiance.lk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pl-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white py-6 text-base uppercase tracking-wider"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Staff members only. For customer bookings, please{' '}
                <Link to="/client/login" className="text-yellow-500 font-semibold hover:text-yellow-400">
                  click here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
