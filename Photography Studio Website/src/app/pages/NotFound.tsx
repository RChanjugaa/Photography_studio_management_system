import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-yellow-500 mb-4">404</h1>
            <h2 className="text-3xl font-serif text-white mb-4 uppercase">Page Not Found</h2>
            <p className="text-xl text-gray-400 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-6 text-base">
                <Home className="size-5 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-2 border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-6 text-base"
            >
              <ArrowLeft className="size-5 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
