import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Trash2, Image as ImageIcon, Calendar, User, X, Upload, Printer, Check, Filter, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import AdminNavigation from '../../components/AdminNavigation';
import { galleryAPI, employeesAPI } from '../../../services/api';
import { format } from 'date-fns';

export default function AdminGallery() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmployeeId, setFilterEmployeeId] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    employeeId: '',
    description: '',
    uploadDate: new Date().toISOString().split('T')[0],
    imageType: 'photo'
  });

  // Check admin authentication + load data
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
      return;
    }
    fetchPhotos();
    fetchEmployees();
  }, [navigate]);

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const response = await galleryAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        const sorted = [...response.data].sort((a, b) => {
          const dateA = new Date(a.upload_date || a.created_at || 0).getTime();
          const dateB = new Date(b.upload_date || b.created_at || 0).getTime();
          return dateB - dateA;
        });
        setPhotos(sorted);
      } else {
        toast.error(response.message || 'Failed to load photos');
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Could not connect to server');
    } finally {
      setLoadingPhotos(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        const normalized = response.data.map((emp: any) => ({
          id: emp.id,
          firstName: emp.first_name || emp.firstName,
          lastName: emp.last_name || emp.lastName,
        }));
        setEmployees(normalized);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const filteredPhotos = photos
    .filter(photo => {
      const matchesSearch = photo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.image_type?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEmployee = !filterEmployeeId || photo.employee_id === parseInt(filterEmployeeId);
      return matchesSearch && matchesEmployee;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.upload_date || a.created_at || 0).getTime() - 
               new Date(b.upload_date || b.created_at || 0).getTime();
      }
      return new Date(b.upload_date || b.created_at || 0).getTime() - 
             new Date(a.upload_date || a.created_at || 0).getTime();
    });

  // Calculate statistics
  const galleryStats = {
    totalPhotos: photos.length,
    latestUpload: photos.length > 0 ? photos[0]?.upload_date : null,
    photosByPhotographer: employees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      count: photos.filter(p => p.employee_id === emp.id).length
    })).filter(p => p.count > 0),
    avgPhotosPerDay: photos.length > 0 ? (photos.length / 7).toFixed(1) : 0
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} - Invalid file type`);
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} - File too large (max 20MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrls(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${validFiles.length} photo(s) selected`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadBatch = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select photos');
      return;
    }

    if (!uploadForm.employeeId) {
      toast.error('Please select a photographer');
      return;
    }

    if (!uploadForm.description.trim()) {
      toast.error('Please add a description');
      return;
    }

    setIsUploading(true);
    
    try {
      let uploadedCount = 0;
      const totalFiles = selectedFiles.length;
      
      // Create array of upload promises
      const uploadPromises = selectedFiles.map((file, index) => {
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = async () => {
            try {
              const base64Data = reader.result as string;
              
              const payload = {
                employeeId: parseInt(uploadForm.employeeId),
                imageUrl: base64Data,
                description: `${uploadForm.description} - Photo ${index + 1} of ${totalFiles}`,
                imageType: uploadForm.imageType,
                uploadDate: uploadForm.uploadDate
              };

              const response = await fetch('http://localhost:5000/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });

              if (response.ok) {
                uploadedCount++;
                toast.success(`Photo ${index + 1}/${totalFiles} uploaded`);
                resolve();
              } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(`Photo ${index + 1} failed: ${errorData.message || 'Unknown error'}`);
                reject(new Error(`Upload failed for photo ${index + 1}`));
              }
            } catch (error) {
              console.error('Upload error:', error);
              toast.error(`Error uploading photo ${index + 1}`);
              reject(error);
            }
          };

          reader.onerror = () => {
            toast.error(`Failed to read photo ${index + 1}`);
            reject(new Error(`Failed to read file ${index + 1}`));
          };

          reader.readAsDataURL(file);
        });
      });

      // Wait for all uploads to complete
      await Promise.allSettled(uploadPromises);

      // Check if all succeeded
      const allSucceeded = uploadPromises.length > 0 && uploadedCount === totalFiles;
      
      if (allSucceeded) {
        toast.success(`All ${uploadedCount} photos uploaded & blog updated!`);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setUploadForm({
          employeeId: '',
          description: '',
          uploadDate: new Date().toISOString().split('T')[0],
          imageType: 'photo'
        });
        setShowUploadDrawer(false);
        setTimeout(() => fetchPhotos(), 500);
      } else if (uploadedCount > 0) {
        toast.success(`${uploadedCount} of ${totalFiles} photos uploaded`);
      }
    } catch (error) {
      console.error('Batch upload error:', error);
      toast.error('Error uploading photos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (!confirm('Delete this photo?')) return;

    try {
      const response = await galleryAPI.delete(id);
      if (response.success) {
        setPhotos(photos.filter(p => p.id !== id));
        toast.success('Photo deleted');
      } else {
        toast.error('Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Error deleting photo');
    }
  };

  const handleGenerateReport = () => {
    const documentDate = format(new Date(), 'MMMM dd, yyyy');
    const totalPhotos = photos.length;
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gallery Report - Ambiance Photography Studio</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, serif; color: #1a1a1a; background: white; }
          
          .page { 
            width: 210mm; 
            min-height: 297mm; 
            padding: 0;
            margin: 0 auto;
            position: relative;
          }

          .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #c9a84c 100%);
            padding: 30px 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            clip-path: ellipse(100% 100% at 50% 0%);
            padding-bottom: 50px;
          }

          .logo-section { color: white; }
          .logo-text { 
            font-size: 36px; 
            font-style: italic; 
            color: #c9a84c;
            font-family: 'Palatino Linotype', Georgia, serif;
          }
          .tagline { 
            font-size: 11px; 
            color: #d4b896; 
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 4px;
          }

          .contact-section { text-align: right; color: white; font-size: 11px; }
          .contact-section p { margin: 3px 0; color: #d4d4d4; }

          .content { padding: 40px 50px; }

          .report-title {
            text-align: center;
            font-size: 22px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #1a1a1a;
            border-bottom: 2px solid #c9a84c;
            border-top: 2px solid #c9a84c;
            padding: 12px 0;
            margin-bottom: 35px;
          }

          .doc-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 12px;
          }
          .doc-meta div { color: #555; }
          .doc-meta strong { color: #1a1a1a; }

          .section {
            margin-bottom: 25px;
            border: 1px solid #e8e0d0;
            border-radius: 4px;
            overflow: hidden;
          }
          .section-header {
            background: linear-gradient(90deg, #1a1a1a, #2d2d2d);
            color: #c9a84c;
            padding: 10px 20px;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .section-body { padding: 20px; }

          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
          }
          .stat-box {
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            text-align: center;
          }
          .stat-label { font-size: 11px; color: #d4d4d4; letter-spacing: 1px; }
          .stat-value { font-size: 24px; color: #c9a84c; font-weight: bold; margin-top: 5px; }

          .photo-list { padding: 0; }
          .photo-item {
            border-bottom: 1px solid #e8e0d0;
            padding: 12px 0;
            font-size: 11px;
          }
          .photo-item:last-child { border-bottom: none; }
          .photo-date { color: #888; }
          .photo-desc { color: #555; margin-top: 3px; }
          .photo-emp { color: #c9a84c; font-weight: 600; }

          .footer {
            text-align: center;
            border-top: 1px solid #c9a84c;
            margin-top: 40px;
            padding-top: 20px;
            color: #888;
            font-size: 10px;
          }

          @media print {
            body { margin: 0; padding: 0; }
            .page { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="logo-section">
              <div class="logo-text">AMBIANCE</div>
              <div class="tagline">Photography Studio</div>
            </div>
            <div class="contact-section">
              <p>+94 702 123 456</p>
              <p>info@ambiance.lk</p>
            </div>
          </div>

          <div class="content">
            <div class="report-title">GALLERY REPORT</div>

            <div class="doc-meta">
              <div>Generated Date: <strong>${documentDate}</strong></div>
              <div>Total Photos: <strong>${totalPhotos}</strong></div>
            </div>

            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Total Photos</div>
                <div class="stat-value">${totalPhotos}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Photo Type</div>
                <div class="stat-value">${photos.filter(p => p.image_type === 'photo').length}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Videos</div>
                <div class="stat-value">${photos.filter(p => p.image_type === 'video').length}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">PHOTO INVENTORY</div>
              <div class="section-body">
                <div class="photo-list">
                  ${photos.slice(0, 20).map((photo, idx) => `
                    <div class="photo-item">
                      <div><strong>${idx + 1}. Photo ID: ${photo.id}</strong></div>
                      <div class="photo-date">Date: ${photo.upload_date ? format(new Date(photo.upload_date), 'MMM dd, yyyy') : 'N/A'}</div>
                      <div class="photo-desc">${photo.description || 'No description'}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This is an official gallery report from Ambiance Photography Studio</p>
              <p>Report Generated: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <AdminNavigation />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gallery Management</h1>
          <p className="text-gray-400">Upload and manage studio photography. Photos automatically appear on home page blog.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setShowUploadDrawer(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2"
          >
            <Plus className="size-4" /> Upload Photos (Bulk)
          </Button>
          <Button
            onClick={handleGenerateReport}
            variant="outline"
            className="border-yellow-600 text-yellow-500 hover:bg-yellow-600/10 gap-2"
          >
            <Printer className="size-4" /> Generate Report
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-gray-400" />
              <Input
                placeholder="Search photos by description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        </Card>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-950 border-blue-800">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Photos</p>
                  <p className="text-3xl font-bold text-white">{galleryStats.totalPhotos}</p>
                </div>
                <ImageIcon className="size-8 text-blue-500 opacity-50" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-950 border-yellow-800">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Avg Daily</p>
                  <p className="text-3xl font-bold text-white">{galleryStats.avgPhotosPerDay}</p>
                </div>
                <TrendingUp className="size-8 text-yellow-500 opacity-50" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-950 border-purple-800">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Photographers</p>
                  <p className="text-3xl font-bold text-white">{galleryStats.photosByPhotographer.length}</p>
                </div>
                <User className="size-8 text-purple-500 opacity-50" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-950 border-green-800">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Latest Upload</p>
                  <p className="text-lg font-bold text-white">
                    {galleryStats.latestUpload ? format(new Date(galleryStats.latestUpload), 'MMM dd') : 'N/A'}
                  </p>
                </div>
                <Clock className="size-8 text-green-500 opacity-50" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <div className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filters:</span>
              </div>
              
              <Select value={filterEmployeeId} onValueChange={setFilterEmployeeId}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="All Photographers" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Photographers</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              {(filterEmployeeId || searchQuery) && (
                <Button
                  onClick={() => {
                    setFilterEmployeeId('');
                    setSearchQuery('');
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:bg-gray-800"
                >
                  Clear Filters
                </Button>
              )}

              <div className="ml-auto text-sm text-gray-400">
                Showing {filteredPhotos.length} of {photos.length} photos
              </div>
            </div>
          </div>
        </Card>

        {/* Photos Grid */}
        <Card className="bg-gray-900 border-gray-800">
          {loadingPhotos ? (
            <div className="p-8 text-center text-gray-400">Loading photos...</div>
          ) : filteredPhotos.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <ImageIcon className="size-16 mx-auto mb-4 opacity-50" />
              <p>No photos yet. Upload your first photo to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                    {/* Photo Preview */}
                    {photo.image_url && (
                      <img
                        src={photo.image_url}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image';
                        }}
                      />
                    )}
                    {!photo.image_url && (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="size-12 text-gray-600" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="border-red-500 text-red-300 hover:bg-red-800"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="mt-3 space-y-1">
                    <Badge className="bg-gray-800 text-gray-300">{photo.image_type}</Badge>
                    {photo.upload_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="size-3" />
                        {format(new Date(photo.upload_date), 'MMM dd, yyyy')}
                      </div>
                    )}
                    <p className="text-sm text-gray-300 line-clamp-2">{photo.description || 'No description'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Upload Drawer */}
      <AnimatePresence>
        {showUploadDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={() => setShowUploadDrawer(false)}
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-800 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Upload Photos (Bulk)</h2>
                <button
                  onClick={() => setShowUploadDrawer(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* File Upload - Multiple */}
              <div className="mb-6">
                <Label className="text-white mb-2 block">Photos (Multiple)</Label>
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-600 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  {selectedFiles.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-400 font-semibold">✓ {selectedFiles.length} photo(s) selected</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="size-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">Drag multiple photos or click to select</p>
                    </>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Preview Thumbnails */}
              {previewUrls.length > 0 && (
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Selected Photos ({previewUrls.length})</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded group">
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded" />
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              

              {/* Employee Selection */}
              <div className="mb-6">
                <Label className="text-white mb-2 block">Photographer *</Label>
                <Select value={uploadForm.employeeId} onValueChange={(value) => setUploadForm({ ...uploadForm, employeeId: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Date */}
              <div className="mb-6">
                <Label className="text-white mb-2 block">Upload Date</Label>
                <Input
                  type="date"
                  value={uploadForm.uploadDate}
                  onChange={(e) => setUploadForm({ ...uploadForm, uploadDate: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Image Type */}
              <div className="mb-6">
                <Label className="text-white mb-2 block">Type</Label>
                <Select value={uploadForm.imageType} onValueChange={(value) => setUploadForm({ ...uploadForm, imageType: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="mb-6">
                <Label className="text-white mb-2 block">Description *</Label>
                <Textarea
                  placeholder="Enter description for all photos..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={3}
                />
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUploadBatch}
                disabled={isUploading || selectedFiles.length === 0}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                {isUploading ? `Uploading ${selectedFiles.length} photos...` : `Upload ${selectedFiles.length} Photo(s)`}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
