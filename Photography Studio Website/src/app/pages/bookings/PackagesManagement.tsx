import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function PackagesManagement() {
  const packages = [
    { id: 1, name: 'Wedding Gold', type: 'Wedding', price: 125000, duration: 6 },
    { id: 2, name: 'Corporate Event', type: 'Corporate', price: 85000, duration: 4 },
    { id: 3, name: 'Studio Portrait', type: 'Studio', price: 15000, duration: 2 },
  ];
  
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Service Packages</h1>
          <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
            <Plus className="size-4 mr-2" />
            Create Package
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <Card key={pkg.id} className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">{pkg.type}</p>
              <div className="text-2xl font-bold text-[#4C8BF5] mb-2">Rs. {pkg.price.toLocaleString()}</div>
              <p className="text-sm text-gray-600">{pkg.duration} hours</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
