import { useState, useEffect } from 'react';
import { Plus, DollarSign, Loader } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import { paymentsAPI } from '../../../services/api';

interface Payment {
  id: number;
  invoice_number: string;
  booking_id: number;
  client_id: number;
  amount: number;
  payment_method: string;
  due_date?: string;
  status: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  booking_number?: string;
}

export default function PaymentsInvoices() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: '',
    clientId: '',
    amount: '',
    paymentMethod: 'cash',
    dueDate: '',
    notes: ''
  });
  
  // Fetch payments on mount
  useEffect(() => {
    fetchPayments();
  }, []);
  
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await paymentsAPI.getAll();
      if (response.success) {
        setPayments(response.data);
      } else {
        toast.error(response.message || 'Failed to load payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments from database');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bookingId || !formData.clientId || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await paymentsAPI.create({
        bookingId: parseInt(formData.bookingId),
        clientId: parseInt(formData.clientId),
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        dueDate: formData.dueDate || null,
        notes: formData.notes || null
      });
      
      if (response.success) {
        toast.success('✓ Payment record created and saved to database');
        setIsDialogOpen(false);
        setFormData({
          bookingId: '',
          clientId: '',
          amount: '',
          paymentMethod: 'cash',
          dueDate: '',
          notes: ''
        });
        // Refresh payments list
        fetchPayments();
      } else {
        toast.error(response.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to create payment');
    }
  };
  
  // Calculate stats
  const stats = payments.reduce((acc, payment) => {
    acc.total += payment.amount;
    if (payment.status === 'completed') {
      acc.collected += payment.amount;
    } else if (payment.status === 'pending') {
      acc.pending += payment.amount;
    }
    return acc;
  }, { total: 0, collected: 0, pending: 0 });
  
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Payments & Invoices</h1>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="size-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="size-5 text-green-600" />
              <span className="text-sm text-gray-600">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-[#1F2937]">Rs. {stats.total.toLocaleString()}</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-sm text-gray-600 mb-2">Outstanding</div>
            <div className="text-2xl font-bold text-orange-600">Rs. {stats.pending.toLocaleString()}</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-sm text-gray-600 mb-2">Collected</div>
            <div className="text-2xl font-bold text-green-600">Rs. {stats.collected.toLocaleString()}</div>
          </Card>
        </div>
        
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader className="size-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Loading payments...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No payments recorded yet. Click "Add Payment" to create one.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.invoice_number}</TableCell>
                    <TableCell>
                      {payment.first_name} {payment.last_name}
                    </TableCell>
                    <TableCell>Rs. {payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{payment.payment_method}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeStyle(payment.status)}>
                        {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
      
      {/* Add Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <div>
              <Label htmlFor="bookingId">Booking ID *</Label>
              <Input
                id="bookingId"
                type="number"
                placeholder="Enter booking ID"
                value={formData.bookingId}
                onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                type="number"
                placeholder="Enter client ID"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount (Rs.) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <select
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                placeholder="Add notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Save Payment
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

