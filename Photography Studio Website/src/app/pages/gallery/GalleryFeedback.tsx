import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Star, Send, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const feedbackTags = [
  { id: 'on-time', label: 'On Time', icon: '⏰' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
  { id: 'friendly', label: 'Friendly', icon: '😊' },
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'responsive', label: 'Responsive', icon: '💬' },
  { id: 'high-quality', label: 'High Quality', icon: '✨' },
];

export default function GalleryFeedback() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [consentPublic, setConsentPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'client') {
      toast.error('Access denied. Client access required.');
      navigate('/gallery');
    }
  }, [navigate]);
  
  const handleToggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      toast.success('Thanks for your feedback!');
      
      setTimeout(() => {
        navigate(`/gallery/${bookingId}`);
      }, 2000);
    }, 1500);
  };
  
  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-green-900/30 border-2 border-green-800 rounded-full size-24 flex items-center justify-center mx-auto mb-6">
            <Check className="size-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-serif text-yellow-500 mb-4 uppercase">Thank You!</h2>
          <p className="text-gray-400 mb-6">Your feedback has been submitted successfully</p>
          <Link to={`/gallery/${bookingId}`}>
            <Button className="bg-red-700 hover:bg-red-800 text-white">
              Back to Gallery
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={`/gallery/${bookingId}`}>
          <Button variant="outline" className="mb-8 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-yellow-500 mb-4 uppercase">Share Your Feedback</h1>
          <p className="text-gray-400 text-lg">
            We'd love to hear about your experience with our photography services
          </p>
        </div>
        
        {/* Feedback Form */}
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8">
          {/* Star Rating */}
          <div className="mb-8">
            <Label className="text-gray-300 text-lg mb-4 block">
              How would you rate your experience? <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-12 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-gray-400 text-sm">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>
          
          {/* Review Text */}
          <div className="mb-8">
            <Label className="text-gray-300 text-lg mb-3 block">
              Tell us more about your experience (Optional)
            </Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              maxLength={500}
              placeholder="Share your thoughts about the photography, service, creativity, professionalism..."
              className="bg-gray-900 border-gray-800 text-white"
            />
            <p className="text-gray-400 text-sm mt-2 text-right">
              {review.length} / 500 characters
            </p>
          </div>
          
          {/* Tags */}
          <div className="mb-8">
            <Label className="text-gray-300 text-lg mb-4 block">
              What did you like most? (Optional)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {feedbackTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleToggleTag(tag.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{tag.icon}</div>
                  <div className={`text-sm font-semibold ${
                    selectedTags.includes(tag.id) ? 'text-yellow-500' : 'text-gray-400'
                  }`}>
                    {tag.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Public Consent */}
          <div className="mb-8 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consentPublic"
                checked={consentPublic}
                onChange={(e) => setConsentPublic(e.target.checked)}
                className="mt-1 w-4 h-4 bg-gray-900 border-gray-800 rounded"
              />
              <Label htmlFor="consentPublic" className="text-gray-300 text-sm cursor-pointer">
                I consent to Ambiance Studio using my feedback as a testimonial on their website 
                and marketing materials. My name may be displayed publicly.
              </Label>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-700 hover:bg-green-800 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
            <Button
              onClick={() => navigate(`/gallery/${bookingId}`)}
              variant="outline"
              disabled={isSubmitting}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </Card>
        
        {/* Info Box */}
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6 mt-6">
          <h3 className="text-lg font-serif text-yellow-500 mb-3 uppercase">Why Your Feedback Matters</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Helps us improve our photography services</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Guides future couples and clients in their decision</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Recognizes our photographers' hard work and creativity</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Your testimonial (if consented) may be featured publicly</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
