import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Upload, X, Check, Image as ImageIcon, Crop } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const cropPresets = [
  { id: 'square', name: 'Square (1080×1080)', width: 1080, height: 1080, recommended: true },
  { id: 'portrait', name: 'Portrait (1080×1350)', width: 1080, height: 1350, recommended: false },
  { id: 'landscape', name: 'Landscape (1080×566)', width: 1080, height: 566, recommended: false },
];

export default function GalleryUpload() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cropPreset, setCropPreset] = useState('square');
  const [publishImmediately, setPublishImmediately] = useState(false);
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin' && userRole !== 'staff') {
      toast.error('Access denied. Staff/Admin access required.');
      navigate('/gallery');
    }
  }, [navigate]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        return false;
      }
      
      // Max 20MB per file
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 20MB)`);
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} photos selected`);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type) && file.size <= 20 * 1024 * 1024;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} photos added`);
  };
  
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select photos to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate upload
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      toast.success(`Upload complete — ${selectedFiles.length} photos added to gallery`);
      
      setTimeout(() => {
        navigate(`/gallery/${bookingId}`);
      }, 1000);
    }, 3500);
  };
  
  const preset = cropPresets.find(p => p.id === cropPreset);
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={`/gallery/${bookingId || ''}`}>
          <Button variant="outline" className="mb-8 border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="size-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Upload Photos</h1>
          <p className="text-gray-400">Upload and crop photos for delivery (Instagram-ready format)</p>
        </div>
        
        {/* Upload Settings */}
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <Label className="text-gray-300 mb-3 block">Crop Preset</Label>
              <Select value={cropPreset} onValueChange={setCropPreset}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {cropPresets.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name} {preset.recommended && '(Recommended)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-gray-400 text-sm mt-2">
                All photos will be cropped to {preset?.width} × {preset?.height}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publishImmediately"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="w-4 h-4 bg-gray-900 border-gray-800 rounded"
              />
              <Label htmlFor="publishImmediately" className="text-gray-300">
                Publish gallery immediately after upload
              </Label>
            </div>
          </div>
          
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-yellow-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              Drop photos here or click to browse
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              JPG, PNG, WebP • Max 20MB per file
            </p>
            <Button className="bg-red-700 hover:bg-red-800 text-white">
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </Card>
        
        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-yellow-500 uppercase">
                Selected Photos ({selectedFiles.length})
              </h3>
              <Button
                onClick={() => setSelectedFiles([])}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <X className="size-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-900">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        onClick={() => handleRemoveFile(index)}
                        size="sm"
                        variant="outline"
                        className="border-red-700 text-red-400 hover:bg-red-900/20"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-2 truncate">{file.name}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Uploading...</span>
                  <span className="text-gray-300 text-sm font-semibold">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            {/* Upload Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white disabled:opacity-50"
              >
                {isUploading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="size-4 mr-2" />
                    Upload {selectedFiles.length} Photos
                  </>
                )}
              </Button>
              <Button
                onClick={() => navigate(`/gallery/${bookingId}`)}
                variant="outline"
                disabled={isUploading}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
        
        {/* Upload Info */}
        <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
          <h3 className="text-lg font-serif text-yellow-500 mb-4 uppercase">Upload Guidelines</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>All photos will be automatically cropped to <strong className="text-white">{preset?.name}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Supported formats: JPG, PNG, WebP</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Maximum file size: 20MB per photo</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Photos will be optimized for web delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>EXIF data (including GPS) will be stripped for privacy</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
