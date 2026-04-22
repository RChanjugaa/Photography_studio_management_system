import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, FileText, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const serviceTypes = [
  { id: 'wedding', name: 'Wedding Photography', icon: '💍' },
  { id: 'event', name: 'Event Photography', icon: '🎉' },
  { id: 'studio', name: 'Studio Portrait', icon: '📸' },
  { id: 'outdoor', name: 'Outdoor Photoshoot', icon: '🌳' },
  { id: 'corporate', name: 'Corporate Event', icon: '💼' },
  { id: 'birthday', name: 'Birthday Party', icon: '🎂' }
];

const timeWindows = [
  'Morning (8:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 4:00 PM)',
  'Evening (4:00 PM - 8:00 PM)',
  'Full Day'
];

export default function ClientBookingRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceType: '',
    preferredDate: '',
    timeWindow: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'client') {
      navigate('/client/login');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceType || !formData.preferredDate || !formData.timeWindow) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Booking request submitted successfully! We\'ll contact you soon.');
      setIsSubmitting(false);
      navigate('/client/bookings');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/client/dashboard">
          <Button variant="outline" className="mb-6 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Request a Booking</h1>
            <p className="text-gray-400">Tell us about your photography needs and we'll get back to you</p>
          </div>
          
          <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-gray-300 font-medium text-base mb-3 block">
                  Service Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: service.id })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.serviceType === service.id
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-black'
                      }`}
                    >
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-semibold text-white text-sm">{service.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="preferredDate" className="text-gray-300 font-medium text-base">
                    Preferred Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                    <input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-11 h-12 rounded-lg border-2 border-gray-700 bg-black text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300 font-medium text-base mb-1.5 block">
                    Preferred Time <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.timeWindow} onValueChange={(value) => setFormData({ ...formData, timeWindow: value })}>
                    <SelectTrigger className="h-12 border-2 border-gray-700 bg-black text-white">
                      <Clock className="size-5 text-gray-500 mr-2" />
                      <SelectValue placeholder="Select time window" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {timeWindows.map((window) => (
                        <SelectItem key={window} value={window} className="text-white hover:bg-gray-800">{window}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-gray-300 font-medium text-base">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={5}
                  placeholder="Tell us more about your requirements, location preferences, number of people, special requests..."
                  className="mt-1.5 border-2 border-gray-700 bg-black text-white placeholder:text-gray-600 resize-none"
                />
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <FileText className="size-5 text-yellow-500" />
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>Our team will review your booking request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>We'll contact you within 24 hours to confirm availability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>You'll receive a confirmation email with booking details</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black h-12 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="size-5 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
                <Link to="/client/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-12">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
