import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function InvoiceViewer() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/payments" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#4C8BF5] mb-6">
          <ArrowLeft className="size-4" />
          Back to Payments
        </Link>
        <div className="flex justify-end mb-4">
          <Button variant="outline"><Download className="size-4 mr-2" />Download PDF</Button>
        </div>
        <Card className="p-8 bg-white"><h1 className="text-2xl font-bold">Invoice Details</h1></Card>
      </div>
    </div>
  );
}
