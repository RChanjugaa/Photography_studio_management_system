import { useState, useEffect } from 'react';
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
import { Printer } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { bookingsAPI, clientsAPI, packagesAPI } from '../../../services/api';

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

export default function CreateBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [dbPackages, setDbPackages] = useState<any[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await clientsAPI.getAll();
        if (response.success && Array.isArray(response.data)) {
          setClients(response.data);
        } else {
          setClients(mockClients);
          toast.error(response.message || 'Failed to load clients, using fallback data');
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients(mockClients);
        toast.error('Unable to load clients; use manual entry');
      }
    };
    loadClients();

    const loadPackages = async () => {
  try {
    const response = await packagesAPI.getActive();
    if (response.success && response.data.length > 0) {
      setDbPackages(response.data.map((p: any) => ({
        id: p.id.toString(),
        type: p.type,
        title: p.title,
        basePrice: parseFloat(p.base_price),
        durationHours: p.duration_hours || 0,
        description: p.description || '',
        active: p.active,
      })));
    }
  } catch (err) {
    console.error('Failed to load packages');
  }
};
loadPackages();
  }, []);



  // Form data
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [createNewClient, setCreateNewClient] = useState(false);
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

 
useEffect(() => {
  if (!selectedDate) return;
  const fetchBookedSlots = async () => {
    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await bookingsAPI.getBookedSlots(dateStr);
      if (response.success) {
        const converted = response.data.map((t: string) => {
          const [h, m] = t.split(':');
          const hour = parseInt(h);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          return `${String(displayHour).padStart(2, '0')}:${m} ${ampm}`;
        });
        setBookedSlots(converted);
      }
    } catch (err) {
      console.error('Failed to fetch booked slots');
    } finally {
      setLoadingSlots(false);
    }
  };
  fetchBookedSlots();
}, [selectedDate]);
  
  const [notes, setNotes] = useState('');
  
  const filteredClients = (clients.length > 0 ? clients : mockClients).filter((client) => {
    const name = (client.name || `${client.first_name || ''} ${client.last_name || ''}`).toString().toLowerCase();
    const email = (client.email || '').toString().toLowerCase();
    const phone = (client.phone || '').toString();
    return (
      name.includes(clientSearch.toLowerCase()) ||
      email.includes(clientSearch.toLowerCase()) ||
      phone.includes(clientSearch)
    );
  });
  
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

  const handlePrint = () => {
  const clientName = selectedClient?.name || 
    `${selectedClient?.first_name || ''} ${selectedClient?.last_name || ''}`.trim() || 
    newClient.name;
  const clientEmail = selectedClient?.email || newClient.email;
  const clientPhone = selectedClient?.phone || newClient.phone;
  const bookingDate = format(new Date(), 'MMMM dd, yyyy');
  const eventDate = selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Not selected';

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking Confirmation - Ambiance</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Georgia, serif; color: #1a1a1a; background: white; }
        
        .page { 
          width: 210mm; 
          min-height: 297mm; 
          padding: 0;
          margin: 0 auto;
          position: relative;
        }

        /* Header wave - top */
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #c9a84c 100%);
          padding: 30px 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          clip-path: ellipse(100% 100% at 50% 0%);
          padding-bottom: 50px;
        }

        .logo-section { color: white; }
        .logo-text { 
          font-size: 36px; 
          font-style: italic; 
          color: #c9a84c;
          font-family: 'Palatino Linotype', Georgia, serif;
        }
        .tagline { 
          font-size: 11px; 
          color: #d4b896; 
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .contact-section { text-align: right; color: white; font-size: 11px; }
        .contact-section p { margin: 3px 0; color: #d4d4d4; }

        /* Content */
        .content { padding: 40px 50px; }

        .confirmation-title {
          text-align: center;
          font-size: 22px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #1a1a1a;
          border-bottom: 2px solid #c9a84c;
          border-top: 2px solid #c9a84c;
          padding: 12px 0;
          margin-bottom: 35px;
        }

        .bill-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          font-size: 12px;
        }
        .bill-meta div { color: #555; }
        .bill-meta strong { color: #1a1a1a; }

        .section {
          margin-bottom: 25px;
          border: 1px solid #e8e0d0;
          border-radius: 4px;
          overflow: hidden;
        }
        .section-header {
          background: linear-gradient(90deg, #1a1a1a, #2d2d2d);
          color: #c9a84c;
          padding: 10px 20px;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .section-body { padding: 20px; }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .field label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #888;
          display: block;
          margin-bottom: 4px;
        }
        .field span {
          font-size: 13px;
          color: #1a1a1a;
          font-weight: 600;
        }

        .notes-box {
          background: #fafaf8;
          border: 1px solid #e8e0d0;
          border-radius: 4px;
          padding: 15px 20px;
          font-size: 12px;
          color: #555;
          min-height: 60px;
          margin-bottom: 25px;
        }

        /* Total box */
        .total-box {
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          color: white;
          padding: 20px 30px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .total-label { font-size: 13px; color: #d4d4d4; letter-spacing: 1px; }
        .total-amount { font-size: 28px; color: #c9a84c; font-weight: bold; }

        /* Footer wave */
        .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #c9a84c 0%, #2d2d2d 50%, #1a1a1a 100%);
          padding: 20px 50px;
          clip-path: ellipse(100% 100% at 50% 100%);
          padding-top: 40px;
          text-align: center;
        }
        .footer-links { display: flex; justify-content: center; gap: 40px; }
        .footer-links span { color: #d4b896; font-size: 11px; }

        .thank-you {
          text-align: center;
          color: #888;
          font-size: 12px;
          font-style: italic;
          margin-bottom: 20px;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page { width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Header -->
        <div class="header">
          <div class="logo-section">
            <div class="logo-text">Ambiance</div>
            <div class="tagline">Capturing Timeless Moments</div>
          </div>
          <div class="contact-section">
            <p>7, 2 Charlemont Rd, Colombo</p>
            <p>+94779774518</p>
            <p>www.ambiance.lk</p>
          </div>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="confirmation-title">Booking Confirmation</div>

          <!-- Bill meta -->
          <div class="bill-meta">
            <div><strong>Bill Date:</strong> ${bookingDate}</div>
            <div><strong>Event Date:</strong> ${eventDate}</div>
            <div><strong>Time:</strong> ${selectedTime}</div>
          </div>

          <!-- Client Info -->
          <div class="section">
            <div class="section-header">Client Information</div>
            <div class="section-body">
              <div class="grid-2">
                <div class="field">
                  <label>Full Name</label>
                  <span>${clientName}</span>
                </div>
                <div class="field">
                  <label>Email</label>
                  <span>${clientEmail}</span>
                </div>
                <div class="field">
                  <label>Phone</label>
                  <span>${clientPhone}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Package Info -->
          <div class="section">
            <div class="section-header">Package Details</div>
            <div class="section-body">
              <div class="grid-2">
                <div class="field">
                  <label>Package Name</label>
                  <span>${selectedPackage?.title}</span>
                </div>
                <div class="field">
                  <label>Service Type</label>
                  <span>${selectedPackage?.type}</span>
                </div>
                <div class="field">
                  <label>Duration</label>
                  <span>${selectedPackage?.durationHours} Hours</span>
                </div>
                <div class="field">
                  <label>Description</label>
                  <span>${selectedPackage?.description}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="section">
            <div class="section-header">Special Notes</div>
            <div class="section-body">
              <div class="notes-box">
                ${notes || 'No special notes provided.'}
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="total-box">
            <div class="total-label">TOTAL AMOUNT</div>
            <div class="total-amount">LKR ${selectedPackage?.basePrice.toLocaleString()}</div>
          </div>

          <div class="thank-you">
            Thank you for choosing Ambiance. We look forward to capturing your timeless moments.
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-links">
            <span>ambiance.lk</span>
            <span>www.ambiance.lk</span>
            <span>studioambiance.lk</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
  
  const handleSubmit = async () => {
    if (!selectedPackage || !selectedDate || !selectedTime) {
      toast.error('Please complete package selection, date, and time before submitting.');
      return;
    }

    setLoading(true);

    try {
      let clientId: number | null = null;

      if (createNewClient) {
        if (!newClient.name || !newClient.email || !newClient.phone) {
          toast.error('New client details are incomplete.');
          return;
        }

        const [firstName, ...restName] = newClient.name.trim().split(' ');
        const lastName = restName.join(' ') || ' '; // ensure not empty

        const clientCreateResponse = await clientsAPI.create({
          firstName,
          lastName,
          email: newClient.email,
          phone: newClient.phone,
          status: 'active',
        });

        if (!clientCreateResponse.success) {
          throw new Error(clientCreateResponse.message || 'Failed to create client');
        }

        clientId = clientCreateResponse.data?.id;
      } else {
        const idValue = selectedClient?.id;
        clientId = Number(idValue);

        if (!clientId || Number.isNaN(clientId)) {
          toast.error('Please select a valid client.');
          return;
        }
      }

      const bookingsPayload = {
        clientId,
        serviceType: selectedPackage?.title || selectedPackage?.type || 'Unknown',
        bookingDate: new Date().toISOString().split('T')[0],
        eventDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
        eventTime: selectedTime,
        duration: selectedPackage?.durationHours || null,
        location: 'Studio',
        amount: selectedPackage?.basePrice || 0,
        notes: notes || null,
        assignedEmployees: [],
      };

      const response = await bookingsAPI.create(bookingsPayload);

      if (response.success) {
        toast.success('Booking created successfully!');
        navigate('/admin/bookings');
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking submit error:', error);
      toast.error('Unable to create booking. Try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const currentMonth = calendarMonth;
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
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
                              <div className="font-semibold text-white">
                                {client.name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unnamed client'}
                              </div>
                              <div className="text-sm text-gray-400">
                                {(client.email || 'No email')} • {(client.phone || 'No phone')}
                              </div>
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
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-800">
                {!createNewClient ? (
                  <Button
                    onClick={() => setCreateNewClient(true)}
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    + Add New Client
                  </Button>
                ) : (
                  <Button
                    onClick={() => { setCreateNewClient(false); setSelectedClient(null); }}
                    variant="outline"
                    className="border-gray-700 text-gray-400 hover:bg-gray-800"
                  >
                    ← Back to Search
                  </Button>
                )}
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
              {(dbPackages.length > 0 ? dbPackages : mockPackages).map((pkg) => (                  <div
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
                    <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const prev = new Date(calendarMonth);
                          prev.setMonth(prev.getMonth() - 1);
                          if (prev >= startOfMonth(today)) setCalendarMonth(prev);
                        }}
                        className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors disabled:opacity-30"
                        disabled={startOfMonth(calendarMonth) <= startOfMonth(today)}
                      >
                        ‹
                      </button>
                      <div className="text-center text-white font-semibold">
                        {format(currentMonth, 'MMMM yyyy')}
                      </div>
                      <button
                        onClick={() => {
                          const next = new Date(calendarMonth);
                          next.setMonth(next.getMonth() + 1);
                          setCalendarMonth(next);
                        }}
                        className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                      >
                        ›
                      </button>
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
                        const dayStart = new Date(day);
                        dayStart.setHours(0, 0, 0, 0);
                        const isPast = dayStart < today;
                        
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
                    {loadingSlots && <span className="text-xs text-gray-500 ml-2">Checking availability...</span>}
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
                      <div className="text-white font-medium">
                        {selectedClient?.name || `${selectedClient?.first_name || ''} ${selectedClient?.last_name || ''}`.trim() || newClient.name}
                      </div>
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
  <div className="flex gap-3">
    <Button 
      onClick={handlePrint} 
      variant="outline" 
      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 flex items-center gap-2"
    >
      <Printer className="size-4" />
      Print Confirmation
    </Button>
    <Button onClick={handleSubmit} disabled={loading} className="bg-red-700 hover:bg-red-800 text-white">
      {loading ? 'Creating Booking...' : 'Create Booking'}
    </Button>
  </div>
</div>
              
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}