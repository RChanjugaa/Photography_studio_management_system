import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, Search, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

// Mock data
const mockClients = [
  { id: 'CL-3001', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+94 77 123 4567' },
  { id: 'CL-3002', name: 'John Smith', email: 'john@example.com', phone: '+94 77 234 5678' },
  { id: 'CL-3003', name: 'Emily Brown', email: 'emily@example.com', phone: '+94 77 345 6789' },
];

const mockPackages = [
  {
    id: 'PKG-101',
    type: 'Wedding',
    title: 'Wedding Gold',
    basePrice: 125000,
    durationHours: 6,
    description: 'Candid + traditional coverage, 2 photographers',
    active: true,
  },
  {
    id: 'PKG-102',
    type: 'Wedding',
    title: 'Wedding Platinum',
    basePrice: 175000,
    durationHours: 8,
    description: 'Full day coverage, 3 photographers, cinematic video',
    active: true,
  },
  {
    id: 'PKG-103',
    type: 'Event',
    title: 'Corporate Event',
    basePrice: 85000,
    durationHours: 8,
    description: 'Multi-camera setup, highlight reel',
    active: true,
  },
  {
    id: 'PKG-104',
    type: 'Studio',
    title: 'Studio Portrait',
    basePrice: 25000,
    durationHours: 2,
    description: 'Professional lighting, multiple outfit changes',
    active: true,
  },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

// Mock booked slots
const bookedSlots = ['10:00 AM', '01:00 PM', '04:00 PM'];

export default function CreateBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [createNewClient, setCreateNewClient] = useState(false);
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  
  const [notes, setNotes] = useState('');
  
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone.includes(clientSearch)
  );
  
  const handleNext = () => {
    if (step === 1 && !selectedClient && !createNewClient) {
      toast.error('Please select or create a client');
      return;
    }
    if (step === 1 && createNewClient && (!newClient.name || !newClient.email || !newClient.phone)) {
      toast.error('Please fill all client details');
      return;
    }
    if (step === 2 && !selectedPackage) {
      toast.error('Please select a package');
      return;
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      toast.error('Please select date and time');
      return;
    }
    if (step < 4) setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Booking created successfully!');
      navigate('/admin/bookings');
      setLoading(false);
    }, 1000);
  };
  
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/bookings" className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
          <ArrowLeft className="size-4" />
          Back to Bookings
        </Link>
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                  s === step ? 'border-yellow-500 bg-yellow-500 text-black' :
                  s < step ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-700 bg-gray-900 text-gray-500'
                }`}>
                  {s < step ? <Check className="size-6" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-20 h-0.5 mx-2 ${
                    s < step ? 'bg-green-500' : 'bg-gray-800'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-4 text-sm">
            <span className={step >= 1 ? 'text-yellow-500' : 'text-gray-500'}>Client</span>
            <span className={step >= 2 ? 'text-yellow-500' : 'text-gray-500'}>Package</span>
            <span className={step >= 3 ? 'text-yellow-500' : 'text-gray-500'}>Date/Time</span>
            <span className={step >= 4 ? 'text-yellow-500' : 'text-gray-500'}>Summary</span>
          </div>
        </div>
        
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
          {/* Step 1: Select Client */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-yellow-500 mb-2 uppercase">Select Client</h2>
                <p className="text-gray-400">Search for an existing client or create a new one</p>
              </div>
              
              <div className="space-y-6">
                {!createNewClient ? (
                  <>
                    <div>
                      <Label className="text-gray-300">Search Client</Label>
                      <div className="relative mt-1.5">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                        <Input
                          placeholder="Search by name, email or phone..."
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                          className="pl-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedClient?.id === client.id
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">{client.name}</div>
                              <div className="text-sm text-gray-400">{client.email} • {client.phone}</div>
                              <div className="text-xs text-gray-500 mt-1">{client.id}</div>
                            </div>
                            {selectedClient?.id === client.id && (
                              <div className="bg-yellow-500 text-black p-1 rounded-full">
                                <Check className="size-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center pt-4 border-t border-gray-800">
                      <Button
                        onClick={() => setCreateNewClient(true)}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Or Create New Client
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Label className="text-gray-300">Full Name *</Label>
                        <Input
                          value={newClient.name}
                          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                          placeholder="John Doe"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Email *</Label>
                        <Input
                          type="email"
                          value={newClient.email}
                          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                          placeholder="john@example.com"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Phone *</Label>
                        <Input
                          type="tel"
                          value={newClient.phone}
                          onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                          placeholder="+94 77 123 4567"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                    
                    <div className="text-center pt-4 border-t border-gray-800">
                      <Button
                        onClick={() => {
                          setCreateNewClient(false);
                          setSelectedClient({ id: 'NEW', ...newClient });
                        }}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Select Existing Client Instead
                      </Button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end mt-8">
                <Button onClick={handleNext} className="bg-red-700 hover:bg-red-800 text-white">
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Select Package */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-yellow-500 mb-2 uppercase">Select Package</h2>
                <p className="text-gray-400">Choose a service package for this booking</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {mockPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPackage?.id === pkg.id
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        {pkg.type}
                      </Badge>
                      {selectedPackage?.id === pkg.id && (
                        <div className="bg-yellow-500 text-black p-1 rounded-full">
                          <Check className="size-4" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-serif text-yellow-500 mb-2">{pkg.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{pkg.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Base Price</span>
                        <span className="text-white font-semibold">LKR {pkg.basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="text-white">{pkg.durationHours} hours</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-red-700 hover:bg-red-800 text-white">
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Date & Time */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-yellow-500 mb-2 uppercase">Select Date & Time</h2>
                <p className="text-gray-400">Choose your preferred date and available time slot</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Calendar */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="size-5" />
                    Select Date
                  </h3>
                  
                  <div className="border-2 border-gray-800 rounded-lg overflow-hidden">
                    {/* Calendar Header */}
                    <div className="bg-gray-900 px-4 py-3 border-b border-gray-800">
                      <div className="text-center text-white font-semibold">
                        {format(currentMonth, 'MMMM yyyy')}
                      </div>
                    </div>
                    
                    {/* Week days */}
                    <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-900/50">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <div key={idx} className="py-2 text-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar days */}
                    <div className="grid grid-cols-7">
                      {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="aspect-square border-r border-b border-gray-800 bg-gray-900/30"></div>
                      ))}
                      
                      {days.map((day) => {
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isPast = day < new Date();
                        
                        return (
                          <button
                            key={day.toString()}
                            onClick={() => !isPast && setSelectedDate(day)}
                            disabled={isPast}
                            className={`aspect-square border-r border-b border-gray-800 p-2 text-sm transition-colors ${
                              isPast ? 'bg-gray-900/30 text-gray-700 cursor-not-allowed' :
                              isSelected ? 'bg-yellow-500 text-black font-bold' :
                              'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            {format(day, 'd')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="size-5" />
                    Available Times
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
                      <span className="text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500/20 border-2 border-red-500"></div>
                      <span className="text-gray-400">Not Available</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      const isSelected = selectedTime === time;
                      
                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          disabled={isBooked}
                          className={`p-4 rounded-lg border-2 transition-all text-sm ${
                            isBooked
                              ? 'bg-red-500/10 border-red-500/30 text-red-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : 'bg-green-500/5 border-green-500/30 text-white hover:bg-green-500/10'
                          }`}
                        >
                          <div className={`font-semibold ${isBooked ? 'text-red-400' : isSelected ? 'text-green-400' : 'text-white'}`}>
                            {time}
                          </div>
                          {isBooked && <div className="text-xs mt-1">Booked</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-red-700 hover:bg-red-800 text-white">
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 4: Summary */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-yellow-500 mb-2 uppercase">Review & Confirm</h2>
                <p className="text-gray-400">Review booking details and add any notes</p>
              </div>
              
              <div className="space-y-6 mb-8">
                {/* Client Info */}
                <div className="p-6 border-2 border-gray-800 rounded-lg bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-yellow-500 mb-4">Client Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Name</div>
                      <div className="text-white font-medium">{selectedClient?.name || newClient.name}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Email</div>
                      <div className="text-white">{selectedClient?.email || newClient.email}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Phone</div>
                      <div className="text-white">{selectedClient?.phone || newClient.phone}</div>
                    </div>
                    {selectedClient?.id && selectedClient.id !== 'NEW' && (
                      <div>
                        <div className="text-gray-500">Client ID</div>
                        <div className="text-white font-mono">{selectedClient.id}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Package Info */}
                <div className="p-6 border-2 border-gray-800 rounded-lg bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-yellow-500 mb-4">Package Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Package</div>
                      <div className="text-white font-medium">{selectedPackage?.title}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Type</div>
                      <div className="text-white">{selectedPackage?.type}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Duration</div>
                      <div className="text-white">{selectedPackage?.durationHours} hours</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Price</div>
                      <div className="text-white font-semibold">LKR {selectedPackage?.basePrice.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                {/* Schedule Info */}
                <div className="p-6 border-2 border-gray-800 rounded-lg bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-yellow-500 mb-4">Schedule</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Date</div>
                      <div className="text-white font-medium">
                        {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Not selected'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Time</div>
                      <div className="text-white">{selectedTime || 'Not selected'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                <div>
                  <Label className="text-gray-300">Internal Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Any special requirements or notes about this booking..."
                    className="mt-1.5 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                  />
                </div>
                
                {/* Total */}
                <div className="p-6 border-2 border-yellow-500/50 rounded-lg bg-gradient-to-r from-yellow-500/10 to-transparent">
                  <div className="flex justify-between items-center">
                    <span className="text-xl text-gray-300">Total Amount</span>
                    <span className="text-3xl font-bold text-yellow-500">
                      LKR {selectedPackage?.basePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="bg-red-700 hover:bg-red-800 text-white">
                  {loading ? 'Creating Booking...' : 'Create Booking'}
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}

