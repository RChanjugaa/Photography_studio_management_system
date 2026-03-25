import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, Plus, Filter, DollarSign, CreditCard, Wallet, TrendingUp, FileText, Download, Eye, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import AdminNavigation from '../../components/AdminNavigation';

// Mock data
const mockPayments = [
  {
    id: 1,
    clientName: 'Silva Family',
    bookingId: 'BK-2024-001',
    invoiceId: 'INV-2024-001',
    amount: 50000,
    method: 'Bank',
    date: '2024-03-15',
    status: 'completed',
    notes: 'Advance payment for wedding'
  },
  {
    id: 2,
    clientName: 'Fernando Family',
    bookingId: 'BK-2024-003',
    invoiceId: 'INV-2024-003',
    amount: 25000,
    method: 'Cash',
    date: '2024-03-10',
    status: 'completed',
    notes: 'Birthday package deposit'
  },
  {
    id: 3,
    clientName: 'Dialog Axiata',
    bookingId: 'BK-2024-002',
    invoiceId: null,
    amount: 100000,
    method: 'Online',
    date: '2024-03-08',
    status: 'completed',
    notes: 'Corporate event advance'
  }
];

const mockInvoices = [
  {
    id: 'INV-2024-001',
    clientName: 'Silva Family',
    bookingId: 'BK-2024-001',
    issueDate: '2024-03-01',
    dueDate: '2024-03-20',
    total: 150000,
    paid: 50000,
    outstanding: 100000,
    status: 'partial'
  },
  {
    id: 'INV-2024-002',
    clientName: 'Jayawardena Family',
    bookingId: 'BK-2024-004',
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    total: 120000,
    paid: 120000,
    outstanding: 0,
    status: 'paid'
  },
  {
    id: 'INV-2024-003',
    clientName: 'Fernando Family',
    bookingId: 'BK-2024-003',
    issueDate: '2024-03-05',
    dueDate: '2024-03-25',
    total: 80000,
    paid: 25000,
    outstanding: 55000,
    status: 'partial'
  },
  {
    id: 'INV-2024-004',
    clientName: 'Perera Enterprises',
    bookingId: 'BK-2024-005',
    issueDate: '2024-02-01',
    dueDate: '2024-02-28',
    total: 90000,
    paid: 0,
    outstanding: 90000,
    status: 'overdue'
  }
];

export default function AdminPayments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('payments');
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [payments, setPayments] = useState(mockPayments);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  
  // Check admin authentication
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    clientName: '',
    bookingId: '',
    invoiceId: '',
    amount: '',
    method: 'Cash',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const stats = [
    { 
      label: 'Total Revenue', 
      value: `Rs. ${(350000).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-400', 
      bg: 'bg-green-900/30', 
      border: 'border-green-800' 
    },
    { 
      label: 'Outstanding', 
      value: `Rs. ${(245000).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-900/30', 
      border: 'border-yellow-800' 
    },
    { 
      label: 'Total Invoices', 
      value: '4', 
      icon: FileText, 
      color: 'text-blue-400', 
      bg: 'bg-blue-900/30', 
      border: 'border-blue-800' 
    },
    { 
      label: 'Payments This Month', 
      value: '3', 
      icon: CreditCard, 
      color: 'text-purple-400', 
      bg: 'bg-purple-900/30', 
      border: 'border-purple-800' 
    },
  ];
  
  const handleAddPayment = () => {
    setPaymentForm({
      clientName: '',
      bookingId: '',
      invoiceId: '',
      amount: '',
      method: 'Cash',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowPaymentDrawer(true);
  };
  
  const handleSavePayment = async () => {
  if (!paymentForm.clientName || !paymentForm.bookingId || !paymentForm.amount) {
    toast.error('Please fill in all required fields');
    return;
  }

  if (parseFloat(paymentForm.amount) <= 0) {
    toast.error('Amount must be greater than 0');
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
       bookingId: parseInt(paymentForm.bookingId.replace(/\D/g, '')) || 1,
        clientId: 1, // TEMP (you can change later)
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.method,
        dueDate: paymentForm.date,
        notes: paymentForm.notes
      })
    });

    const data = await response.json();

    console.log("API RESPONSE:", data);

    if (data.success) {
      // ✅ Update UI
      const newPayment = {
        id: payments.length + 1,
        ...paymentForm,
        amount: parseFloat(paymentForm.amount),
        status: 'completed'
      };

      setPayments([newPayment, ...payments]);

      toast.success("Payment saved to DB ✅");
      setShowPaymentDrawer(false);
    } else {
      toast.error("Failed to save payment ❌");
    }

  } catch (error) {
    console.error("ERROR:", error);
    toast.error("Server error ❌");
  }
};
  
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
  
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = `${invoice.id} ${invoice.clientName} ${invoice.bookingId}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = `${payment.clientName} ${payment.bookingId}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.method.toLowerCase() === methodFilter.toLowerCase();
    return matchesSearch && matchesMethod;
  });
  
  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Payments & Invoices</h1>
              <p className="text-gray-400">Manage payments, invoices, and financial records</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                onClick={handleAddPayment}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                <Plus className="size-4 mr-2" />
                Add Payment
              </Button>
              <Link to="/admin/invoices/new">
                <Button className="bg-red-700 hover:bg-red-800 text-white">
                  <FileText className="size-4 mr-2" />
                  Generate Invoice
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${stat.border} ${stat.bg} p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`size-10 ${stat.color}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'payments'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'invoices'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Invoices
            </button>
          </div>
          
          {/* Filters */}
          <div className="grid md:grid-cols-12 gap-4 mb-8">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 bg-gray-900 border-gray-800 text-white"
                />
              </div>
            </div>
            {activeTab === 'invoices' ? (
              <div className="md:col-span-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="md:col-span-3">
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="md:col-span-3">
              <Link to="/admin/reports/finance">
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                  <TrendingUp className="size-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Content */}
          {activeTab === 'payments' ? (
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Booking ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Method</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-gray-400 font-mono text-sm">#{payment.id.toString().padStart(4, '0')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">{payment.clientName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 font-mono text-sm">{payment.bookingId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-semibold">Rs. {payment.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-gray-800 text-gray-300">{payment.method}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white text-sm">{payment.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">{payment.notes || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Invoice #</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Booking ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Dates</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Paid</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Outstanding</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-yellow-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-white font-mono font-semibold">{invoice.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">{invoice.clientName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 font-mono text-sm">{invoice.bookingId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-sm">{invoice.issueDate}</div>
                          <div className="text-gray-400 text-xs">Due: {invoice.dueDate}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">Rs. {invoice.total.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-semibold">Rs. {invoice.paid.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400 font-semibold">Rs. {invoice.outstanding.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusBadgeClass(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/invoices/${invoice.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                              >
                                <Eye className="size-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              <Download className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
        
        {/* Add Payment Drawer */}
        <AnimatePresence>
          {showPaymentDrawer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPaymentDrawer(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="ml-auto h-full w-full max-w-2xl bg-gradient-to-br from-[#2a0f0f] to-black border-l-2 border-gray-800 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-serif text-yellow-500 uppercase">Record Payment</h2>
                    <button onClick={() => setShowPaymentDrawer(false)} className="text-gray-400 hover:text-white">
                      <X className="size-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-gray-300">Client Name *</Label>
                      <Input
                        value={paymentForm.clientName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, clientName: e.target.value })}
                        placeholder="e.g., Silva Family"
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Booking ID *</Label>
                        <Input
                          value={paymentForm.bookingId}
                          onChange={(e) => setPaymentForm({ ...paymentForm, bookingId: e.target.value })}
                          placeholder="BK-2024-XXX"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Invoice ID (Optional)</Label>
                        <Input
                          value={paymentForm.invoiceId}
                          onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
                          placeholder="INV-2024-XXX"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Amount (Rs.) *</Label>
                        <Input
                          type="number"
                          value={paymentForm.amount}
                          onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Payment Method *</Label>
                        <Select value={paymentForm.method} onValueChange={(value) => setPaymentForm({ ...paymentForm, method: value })}>
                          <SelectTrigger className="mt-1.5 bg-gray-900 border-gray-800 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800">
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Bank">Bank Transfer</SelectItem>
                            <SelectItem value="Card">Card</SelectItem>
                            <SelectItem value="Online">Online Payment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Date</Label>
                      <Input
                        type="date"
                        value={paymentForm.date}
                        onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Notes (Optional)</Label>
                      <Textarea
                        value={paymentForm.notes}
                        onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                        rows={3}
                        placeholder="Additional notes..."
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-6">
                      <Button
                        onClick={() => setShowPaymentDrawer(false)}
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSavePayment}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                      >
                        Record Payment
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
