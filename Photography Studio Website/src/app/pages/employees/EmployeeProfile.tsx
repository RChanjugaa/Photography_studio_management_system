import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/card';

export default function EmployeeProfile() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/employees" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#4C8BF5] mb-6">
          <ArrowLeft className="size-4" />
          Back to Team
        </Link>
        <Card className="p-8 bg-white"><h1 className="text-2xl font-bold">Employee Profile</h1></Card>
      </div>
    </div>
  );
}
