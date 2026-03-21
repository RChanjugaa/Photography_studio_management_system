import { Calendar } from 'lucide-react';
import { Card } from '../../components/ui/card';

export default function CalendarView() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-8">Booking Calendar</h1>
        <Card className="p-8 bg-white text-center">
          <Calendar className="size-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Calendar view coming soon</p>
        </Card>
      </div>
    </div>
  );
}
