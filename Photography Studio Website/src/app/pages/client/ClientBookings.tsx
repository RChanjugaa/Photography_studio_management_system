import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, FileText, Plus, Printer } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';
import { format } from 'date-fns';

const mockBookings = [
  {
    id: 'BK-2024-101',
    type: 'Wedding Photography',
    requestedDate: '2024-04-15',
    scheduledDate: '2024-04-15 14:00',
    status: 'confirmed',
    photographer: 'Amaya Silva',
    package: 'Wedding Premium Package'
  },
  {
    id: 'BK-2024-089',
    type: 'Birthday Party',
    requestedDate: '2024-03-28',
    scheduledDate: null,
    status: 'pending',
    photographer: null,
    package: 'Birthday Basic Package'
  },
  {
    id: 'BK-2024-075',
    type: 'Corporate Event',
    requestedDate: '2024-02-10',
    scheduledDate: '2024-02-10 15:00',
    status: 'completed',
    photographer: 'Kasun Fernando',
    package: 'Corporate Package'
  },
  {
    id: 'REQ-2024-045',
    type: 'Outdoor Photoshoot',
    requestedDate: '2024-05-05',
    scheduledDate: null,
    status: 'request_pending',
    photographer: null,
    package: null
  }
];

export default function ClientBookings() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'client') {
      navigate('/client/login');
    }
  }, [navigate]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-900/50 text-green-400 border border-green-700">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-blue-900/50 text-blue-400 border border-blue-700">Pending</Badge>;
      case 'request_pending':
        return <Badge className="bg-yellow-900/50 text-yellow-400 border border-yellow-700">Request Pending</Badge>;
      case 'completed':
        return <Badge className="bg-gray-800 text-gray-300 border border-gray-700">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-900/50 text-red-400 border border-red-700">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-800 text-gray-400 border border-gray-700">{status}</Badge>;
    }
  };

  const handlePrint = (booking: typeof mockBookings[0]) => {
    const bookingDate = format(new Date(), 'MMMM dd, yyyy');
    const eventDate = booking.scheduledDate ? format(new Date(booking.scheduledDate), 'MMMM dd, yyyy') : 'Not scheduled';
    const eventTime = booking.scheduledDate ? booking.scheduledDate.split(' ')[1] : 'N/A';

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

          .booking-number {
            font-size: 14px;
            color: #c9a84c;
            font-weight: bold;
            margin-bottom: 10px;
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
              <div class="tagline">Photography Studio</div>
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
            
            <div class="booking-number">Booking #${booking.id}</div>

            <!-- Bill meta -->
            <div class="bill-meta">
              <div><strong>Bill Date:</strong> ${bookingDate}</div>
              <div><strong>Event Date:</strong> ${eventDate}</div>
              <div><strong>Event Time:</strong> ${eventTime}</div>
              <div><strong>Status:</strong> ${booking.status.toUpperCase().replace(/_/g, ' ')}</div>
            </div>

            <!-- Booking Details -->
            <div class="section">
              <div class="section-header">Booking Details</div>
              <div class="section-body">
                <div class="grid-2">
                  <div class="field">
                    <label>Booking Type</label>
                    <span>${booking.type}</span>
                  </div>
                  <div class="field">
                    <label>Package</label>
                    <span>${booking.package || 'N/A'}</span>
                  </div>
                  <div class="field">
                    <label>Requested Date</label>
                    <span>${booking.requestedDate}</span>
                  </div>
                  <div class="field">
                    <label>Assigned Photographer</label>
                    <span>${booking.photographer || 'To be assigned'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="thank-you">
              Thank you for choosing Ambiance Photography Studio. We look forward to capturing your timeless moments.
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
  
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/client/dashboard">
          <Button variant="outline" className="mb-6 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
              <p className="text-gray-400">View all your photography bookings and requests</p>
            </div>
            <Link to="/client/book">
              <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                <Plus className="size-4 mr-2" />
                New Booking Request
              </Button>
            </Link>
          </div>
          
          <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 overflow-hidden shadow-xl">
            {/* Table Header */}
            <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-yellow-500 uppercase">
                <div className="col-span-2">Booking ID</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Requested Date</div>
                <div className="col-span-2">Scheduled Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-800">
              {mockBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-4 hover:bg-gray-900/30 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <span className="text-gray-400 font-mono text-sm">{booking.id}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white font-medium">{booking.type}</span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="size-4" />
                        <span>{booking.requestedDate}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {booking.scheduledDate ? (
                        <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                          <Clock className="size-4" />
                          <span>{booking.scheduledDate}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">Not scheduled</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="col-span-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                          <FileText className="size-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePrint(booking)}
                          className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10 hover:text-yellow-300"
                        >
                          <Printer className="size-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info (collapsed) */}
                  {booking.package && (
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-400">Package:</span> {booking.package}
                      {booking.photographer && (
                        <span className="ml-4"><span className="font-medium text-gray-400">Photographer:</span> {booking.photographer}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
          
          {/* Empty State (if no bookings) */}
          {mockBookings.length === 0 && (
            <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-12 text-center shadow-xl">
              <FileText className="size-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
              <p className="text-gray-400 mb-6">Start by requesting your first booking</p>
              <Link to="/client/book">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                  <Plus className="size-4 mr-2" />
                  Request a Booking
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
