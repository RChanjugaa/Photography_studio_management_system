import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Download, Share2, Edit, CheckCircle, X, Copy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import AdminNavigation from '../../components/AdminNavigation';

// Mock invoice data
const mockInvoiceData: any = {
  'INV-2024-001': {
    id: 'INV-2024-001',
    clientName: 'Silva Family',
    clientEmail: 'silva@email.com',
    clientPhone: '+94 77 123 4567',
    bookingId: 'BK-2024-001',
    issueDate: '2024-03-01',
    dueDate: '2024-03-20',
    status: 'partial',
    items: [
      { id: 1, name: 'Premium Wedding Package', qty: 1, unitPrice: 120000, total: 120000 },
      { id: 2, name: 'Additional Hours (3 hrs)', qty: 3, unitPrice: 10000, total: 30000 }
    ],
    subtotal: 150000,
    discount: 0,
    tax: 0,
    total: 150000,
    paid: 50000,
    outstanding: 100000,
    notes: 'Payment terms: 50% advance, balance due on event day.',
    terms: 'Cancellations must be made 7 days prior. Non-refundable after confirmation.'
  },
  'INV-2024-002': {
    id: 'INV-2024-002',
    clientName: 'Jayawardena Family',
    clientEmail: 'jayawardena@email.com',
    clientPhone: '+94 77 234 5678',
    bookingId: 'BK-2024-004',
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    status: 'paid',
    items: [
      { id: 1, name: 'Traditional Wedding Package', qty: 1, unitPrice: 100000, total: 100000 },
      { id: 2, name: 'Photo Album (Premium)', qty: 1, unitPrice: 20000, total: 20000 }
    ],
    subtotal: 120000,
    discount: 0,
    tax: 0,
    total: 120000,
    paid: 120000,
    outstanding: 0,
    notes: 'Full payment received. Thank you!',
    terms: 'All photos will be delivered within 2 weeks.'
  }
};

export default function AdminInvoiceDetail() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const invoice = mockInvoiceData[invoiceId || ''];
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  useEffect(() => {
    if (invoiceId) {
      setShareLink(`${window.location.origin}/invoices/public/${invoiceId}`);
    }
  }, [invoiceId]);
  
  if (!invoice) {
    return (
      <>
        <AdminNavigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl text-yellow-500 mb-4">Invoice Not Found</h2>
            <Link to="/admin/payments">
              <Button className="bg-red-700 hover:bg-red-800 text-white">
                Back to Payments
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-900/30 text-green-300 border-green-800';
      case 'partial':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-800';
      case 'overdue':
        return 'bg-red-900/30 text-red-300 border-red-800';
      case 'draft':
        return 'bg-gray-800 text-gray-400';
      case 'unpaid':
        return 'bg-blue-900/30 text-blue-300 border-blue-800';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };
  
  const handleDownloadPDF = () => {
    toast.success('Downloading invoice PDF...');
  };
  
  const handleShare = () => {
    setShowShareModal(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Public link copied to clipboard');
  };
  
  const handleMarkPaid = () => {
    toast.success('Invoice marked as Paid');
    navigate('/admin/payments');
  };
  
  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/admin/payments">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="size-4 mr-2" />
                Back to Payments
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Download className="size-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Share2 className="size-4 mr-2" />
                Share
              </Button>
              {invoice.outstanding > 0 && (
                <Button
                  onClick={handleMarkPaid}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  <CheckCircle className="size-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
          
          {/* Invoice Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-gray-800 bg-white p-12">
              {/* Header */}
              <div className="flex items-start justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-serif text-yellow-600 mb-2 uppercase">Ambiance Studio</h1>
                  <p className="text-gray-600">Photography & Cinematography</p>
                  <p className="text-gray-600 text-sm mt-2">Colombo, Sri Lanka</p>
                  <p className="text-gray-600 text-sm">+94 11 234 5678</p>
                  <p className="text-gray-600 text-sm">studio@ambiance.lk</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
                  <p className="text-gray-600 font-mono font-semibold">{invoice.id}</p>
                  <Badge className={`mt-2 ${getStatusBadgeClass(invoice.status)}`}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
              
              {/* Bill To & Dates */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
                  <p className="text-gray-800 font-semibold text-lg">{invoice.clientName}</p>
                  <p className="text-gray-600">{invoice.clientPhone}</p>
                  <p className="text-gray-600">{invoice.clientEmail}</p>
                  <p className="text-gray-600 text-sm mt-2">Booking: {invoice.bookingId}</p>
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">Issue Date:</span>
                    <p className="text-gray-800 font-semibold">{invoice.issueDate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Due Date:</span>
                    <p className="text-gray-800 font-semibold">{invoice.dueDate}</p>
                  </div>
                </div>
              </div>
              
              {/* Items Table */}
              <div className="mb-12">
                <table className="w-full">
                  <thead className="border-b-2 border-gray-300">
                    <tr>
                      <th className="text-left py-3 text-sm font-semibold text-gray-700 uppercase">Description</th>
                      <th className="text-center py-3 text-sm font-semibold text-gray-700 uppercase">Qty</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase">Unit Price</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-4 text-gray-800">{item.name}</td>
                        <td className="py-4 text-center text-gray-800">{item.qty}</td>
                        <td className="py-4 text-right text-gray-800">Rs. {item.unitPrice.toLocaleString()}</td>
                        <td className="py-4 text-right font-semibold text-gray-800">Rs. {item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Totals */}
              <div className="flex justify-end mb-12">
                <div className="w-full md:w-1/2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800 font-semibold">Rs. {invoice.subtotal.toLocaleString()}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-red-600 font-semibold">- Rs. {invoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  {invoice.tax > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Tax:</span>
                      <span className="text-gray-800 font-semibold">Rs. {invoice.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b-2 border-gray-300">
                    <span className="text-gray-800 font-bold">Total:</span>
                    <span className="text-gray-800 font-bold text-lg">Rs. {invoice.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-green-600">Payments Received:</span>
                    <span className="text-green-600 font-semibold">Rs. {invoice.paid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-yellow-50 px-4 -mx-4 mt-2 rounded">
                    <span className="text-gray-800 font-bold">Outstanding:</span>
                    <span className="text-yellow-700 font-bold text-lg">Rs. {invoice.outstanding.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Notes & Terms */}
              {invoice.notes && (
                <div className="mb-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Notes</h3>
                  <p className="text-gray-600 text-sm">{invoice.notes}</p>
                </div>
              )}
              
              {invoice.terms && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Terms & Conditions</h3>
                  <p className="text-gray-600 text-sm">{invoice.terms}</p>
                </div>
              )}
              
              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-sm">Thank you for your business!</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-yellow-500 uppercase">Share Invoice</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="size-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <Label className="text-gray-300 mb-2 block">Public Link</Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  className="bg-red-700 hover:bg-red-800 text-white"
                >
                  <Copy className="size-4" />
                </Button>
              </div>
              <p className="text-gray-400 text-xs mt-2">This link will expire in 30 days</p>
            </div>
            
            <Button
              onClick={() => setShowShareModal(false)}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}
