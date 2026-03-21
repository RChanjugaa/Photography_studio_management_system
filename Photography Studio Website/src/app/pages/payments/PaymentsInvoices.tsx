import { Plus, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export default function PaymentsInvoices() {
  const invoices = [
    { id: 'INV-301', client: 'John Johnson', amount: 125000, paid: 125000, status: 'Paid', date: '2026-03-01' },
    { id: 'INV-298', client: 'Tech Corp', amount: 85000, paid: 42500, status: 'Partial', date: '2026-02-28' },
    { id: 'INV-295', client: 'Emma Rodriguez', amount: 15000, paid: 0, status: 'Unpaid', date: '2026-02-25' },
  ];
  
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Payments & Invoices</h1>
          <div className="flex gap-3">
            <Button variant="outline">
              <Plus className="size-4 mr-2" />
              Add Payment
            </Button>
            <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
              <Plus className="size-4 mr-2" />
              Generate Invoice
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="size-5 text-green-600" />
              <span className="text-sm text-gray-600">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-[#1F2937]">Rs. 2,450,000</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-sm text-gray-600 mb-2">Outstanding</div>
            <div className="text-2xl font-bold text-orange-600">Rs. 42,500</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-sm text-gray-600 mb-2">Overdue</div>
            <div className="text-2xl font-bold text-red-600">Rs. 0</div>
          </Card>
        </div>
        
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>Rs. {invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>Rs. {invoice.paid.toLocaleString()}</TableCell>
                  <TableCell>Rs. {(invoice.amount - invoice.paid).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'Partial' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
