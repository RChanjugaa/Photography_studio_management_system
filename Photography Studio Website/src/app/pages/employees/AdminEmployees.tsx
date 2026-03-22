import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function AdminEmployees() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Employee Management</h1>
          <Button className="bg-[#4C8BF5] hover:bg-[#3A7DE8]">
            <Plus className="size-4 mr-2" />
            Add Employee
          </Button>
        </div>
        <Card className="p-8 bg-white"><p>Employee administration</p></Card>
      </div>
    </div>
  );
}
