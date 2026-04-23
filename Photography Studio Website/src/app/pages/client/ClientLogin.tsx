import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { authAPI } from '../../../services/api';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authAPI.clientLogin(email, password);
      
      if (response.success && response.data) {
        // Store client info in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'client');
        localStorage.setItem('userName', response.data.name || response.data.first_name + ' ' + response.data.last_name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', response.data.id || 'CLT-' + Math.random());
        localStorage.setItem('clientId', response.data.id || '');
        
        toast.success('Welcome back!');
        navigate('/client/dashboard');
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-500 mb-2">Ambiance Studio</h1>
          <p className="text-gray-400">Client Portal Login</p>
        </div>
        
        <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Sign In</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-11 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-black text-yellow-500 focus:ring-yellow-500" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-yellow-500 hover:text-yellow-400 font-medium">
                Forgot password?
              </a>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold text-base"
            >
              {isLoading ? (
                <>Signing in...</>
              ) : (
                <>
                  <LogIn className="size-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/client/register" className="text-yellow-500 hover:text-yellow-400 font-semibold">
                Register here
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