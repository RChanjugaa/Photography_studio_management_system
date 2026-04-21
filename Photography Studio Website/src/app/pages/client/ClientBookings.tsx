import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, FileText, Plus, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';
import { toast } from 'sonner';

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
  const [clientId, setClientId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'client') {
      navigate('/client/login');
    }
    
    // Get client ID from localStorage
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
    }
  }, [navigate]);
  
  const handleDownloadReport = async () => {
    if (!clientId) {
      toast.error('Unable to download report - Client ID not found');
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}/report`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const reportData = await response.json();

      if (!reportData.success) {
        throw new Error(reportData.message || 'Failed to generate report');
      }

      // Generate HTML report
      const htmlContent = generateReportHTML(reportData.data);

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `client-report-${clientId}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  const generateReportHTML = (data: any) => {
    const { client, bookings, payments, bookingStats, paymentStats, generatedAt } = data;
    const stats = bookingStats[0] || {};
    const payStats = paymentStats[0] || {};

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Photography Studio - Client Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
          .container { max-width: 900px; margin: 40px auto; background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; }
          header { border-bottom: 3px solid #d4a574; padding-bottom: 20px; margin-bottom: 30px; }
          h1 { color: #d4a574; font-size: 28px; margin-bottom: 10px; }
          .report-meta { font-size: 12px; color: #666; }
          .section { margin-bottom: 40px; }
          .section-title { font-size: 18px; font-weight: bold; color: #d4a574; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
          .info-item { background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #d4a574; }
          .info-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
          .info-value { font-size: 18px; font-weight: bold; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f0f0f0; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #d4a574; color: #333; }
          td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
          tr:hover { background: #f9f9f9; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-completed { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-cancelled { background: #f8d7da; color: #721c24; }
          .amount { font-weight: bold; color: #d4a574; }
          footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
          .stat-card { background: #f9f9f9; padding: 15px; border-radius: 4px; text-align: center; border: 1px solid #e0e0e0; }
          .stat-number { font-size: 24px; font-weight: bold; color: #d4a574; margin-bottom: 5px; }
          .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
          .no-data { color: #999; font-style: italic; }
          @media print {
            body { background: white; }
            .container { box-shadow: none; margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>📸 Photography Studio Client Report</h1>
            <div class="report-meta">
              <p>Generated on: ${new Date(generatedAt).toLocaleString()}</p>
              <p>Report ID: ${client.id}</p>
            </div>
          </header>

          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Full Name</div>
                <div class="info-value">${client.first_name} ${client.last_name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${client.email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Phone</div>
                <div class="info-value">${client.phone || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">${client.status}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Registration Date</div>
                <div class="info-value">${new Date(client.registration_date).toLocaleDateString()}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Last Login</div>
                <div class="info-value">${client.last_login ? new Date(client.last_login).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Booking Summary</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${stats.total_bookings || 0}</div>
                <div class="stat-label">Total Bookings</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.completed_bookings || 0}</div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.pending_bookings || 0}</div>
                <div class="stat-label">Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">$${(stats.total_booking_value || 0).toFixed(2)}</div>
                <div class="stat-label">Total Value</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Summary</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${payStats.total_payments || 0}</div>
                <div class="stat-label">Total Payments</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${payStats.completed_payments || 0}</div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${payStats.pending_payments || 0}</div>
                <div class="stat-label">Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">$${(payStats.total_paid || 0).toFixed(2)}</div>
                <div class="stat-label">Total Paid</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Booking History</div>
            ${bookings && bookings.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Service Type</th>
                    <th>Event Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${bookings.map((b: any) => `
                    <tr>
                      <td>${b.booking_number}</td>
                      <td>${b.service_type}</td>
                      <td>${new Date(b.event_date).toLocaleDateString()}</td>
                      <td>
                        <span class="status-badge status-${b.status}">
                          ${b.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td class="amount">$${(b.amount || 0).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p class="no-data">No bookings found</p>'}
          </div>

          <div class="section">
            <div class="section-title">Payment History</div>
            ${payments && payments.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Booking #</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${payments.map((p: any) => `
                    <tr>
                      <td>${p.id}</td>
                      <td>${p.booking_number || 'N/A'}</td>
                      <td>${new Date(p.payment_date).toLocaleDateString()}</td>
                      <td>
                        <span class="status-badge status-${p.status}">
                          ${p.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td class="amount">$${(p.amount || 0).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p class="no-data">No payments found</p>'}
          </div>

          <footer>
            <p>This report is confidential and contains sensitive information. Please keep it secure.</p>
            <p>Photography Studio Management System © 2024</p>
          </footer>
        </div>
      </body>
      </html>
    `;
  };
  
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
            <div className="flex gap-3">
              <Button 
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold"
              >
                <Download className="size-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download Report'}
              </Button>
              <Link to="/client/book">
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                  <Plus className="size-4 mr-2" />
                  New Booking Request
                </Button>
              </Link>
            </div>
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
                <div className="col-span-2">Action</div>
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
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                        <FileText className="size-4 mr-1" />
                        View
                      </Button>
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
