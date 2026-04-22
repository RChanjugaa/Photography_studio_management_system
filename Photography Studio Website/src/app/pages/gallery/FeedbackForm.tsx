import { ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';

export default function FeedbackForm() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/gallery" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#4C8BF5] mb-6">
          <ArrowLeft className="size-4" />
          Back to Gallery
        </Link>
        <Card className="p-8 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center">Share Your Feedback</h1>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="size-10 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Review</label>
              <Textarea rows={5} placeholder="Share your experience..." />
            </div>
            <Button className="w-full bg-[#4C8BF5] hover:bg-[#3A7DE8]">Submit Feedback</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
