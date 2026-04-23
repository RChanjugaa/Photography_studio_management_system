import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { bookingsAPI } from '../../../services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function BookingDetails() {
  const { id } = useParams();
  const bookingId = Number(id);
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    serviceType: '',
    eventDate: '',
    eventTime: '',
    location: '',
    amount: '',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    if (!bookingId) return;
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getOne(bookingId);
      if (response.success && response.data) {
        setBooking(response.data);
        setForm({
          serviceType: response.data.service_type || '',
          eventDate: response.data.event_date || '',
          eventTime: response.data.event_time || '',
          location: response.data.location || '',
          amount: response.data.amount ? response.data.amount.toString() : '',
          status: response.data.status || 'pending',
          notes: response.data.notes || '',
        });
      } else {
        toast.error(response.message || 'Booking not found');
        navigate('/admin/bookings');
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Failed to load booking data');
      navigate('/admin/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!bookingId) return;
    setSaving(true);

    try {
      const response = await bookingsAPI.update(bookingId, {
        serviceType: form.serviceType,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        location: form.location,
        amount: parseFloat(form.amount) || 0,
        status: form.status,
        notes: form.notes,
      });

      if (response.success) {
        toast.success('Booking updated successfully');
        loadBooking();
      } else {
        toast.error(response.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!bookingId || !window.confirm('Delete this booking?')) return;
    try {
      const response = await bookingsAPI.delete(bookingId);
      if (response.success) {
        toast.success('Booking deleted');
        navigate('/admin/bookings');
      } else {
        toast.error(response.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handlePrint = () => {
    if (!booking) return;

    const clientName = booking.first_name || booking.last_name 
      ? `${booking.first_name || ''} ${booking.last_name || ''}`.trim()
      : 'Unknown Client';
    const clientEmail = booking.email || 'N/A';
    const clientPhone = booking.phone || 'N/A';
    const bookingDate = format(new Date(), 'MMMM dd, yyyy');
    const eventDate = booking.event_date ? format(new Date(booking.event_date), 'MMMM dd, yyyy') : 'Not set';
    const eventTime = booking.event_time || 'Not set';

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Confirmation - Ambiance Photography Studio</title>
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

          /* Header wave - top */
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

          /* Content */
          .content { padding: 40px 50px; }

          .confirmation-title {
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

          .bill-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 12px;
          }
          .bill-meta div { color: #555; }
          .bill-meta strong { color: #1a1a1a; }

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

          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
          }
          .field label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            display: block;
            margin-bottom: 4px;
          }
          .field span {
            font-size: 13px;
            color: #1a1a1a;
            font-weight: 600;
          }

          .notes-box {
            background: #fafaf8;
            border: 1px solid #e8e0d0;
            border-radius: 4px;
            padding: 15px 20px;
            font-size: 12px;
            color: #555;
            min-height: 60px;
            margin-bottom: 25px;
          }

          /* Total box */
          .total-box {
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            color: white;
            padding: 20px 30px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          .total-label { font-size: 13px; color: #d4d4d4; letter-spacing: 1px; }
          .total-amount { font-size: 28px; color: #c9a84c; font-weight: bold; }

          /* Footer wave */
          .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #c9a84c 0%, #2d2d2d 50%, #1a1a1a 100%);
            padding: 20px 50px;
            clip-path: ellipse(100% 100% at 50% 100%);
            padding-top: 40px;
            text-align: center;
          }
          .footer-links { display: flex; justify-content: center; gap: 40px; }
          .footer-links span { color: #d4b896; font-size: 11px; }

          .thank-you {
            text-align: center;
            color: #888;
            font-size: 12px;
            font-style: italic;
            margin-bottom: 20px;
          }

          .booking-number {
            font-size: 14px;
            color: #c9a84c;
            font-weight: bold;
            margin-bottom: 10px;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <div class="logo-text">Ambiance</div>
              <div class="tagline">Photography Studio</div>
            </div>
            <div class="contact-section">
              <p>7, 2 Charlemont Rd, Colombo</p>
              <p>+94779774518</p>
              <p>www.ambiance.lk</p>
            </div>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="confirmation-title">Booking Confirmation</div>
            
            <div class="booking-number">Booking #${booking.booking_number || booking.id}</div>

            <!-- Bill meta -->
            <div class="bill-meta">
              <div><strong>Bill Date:</strong> ${bookingDate}</div>
              <div><strong>Event Date:</strong> ${eventDate}</div>
              <div><strong>Event Time:</strong> ${eventTime}</div>
              <div><strong>Status:</strong> ${booking.status?.toUpperCase() || 'PENDING'}</div>
            </div>

            <!-- Client Info -->
            <div class="section">
              <div class="section-header">Client Information</div>
              <div class="section-body">
                <div class="grid-2">
                  <div class="field">
                    <label>Full Name</label>
                    <span>${clientName}</span>
                  </div>
                  <div class="field">
                    <label>Email</label>
                    <span>${clientEmail}</span>
                  </div>
                  <div class="field">
                    <label>Phone</label>
                    <span>${clientPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Details -->
            <div class="section">
              <div class="section-header">Booking Details</div>
              <div class="section-body">
                <div class="grid-3">
                  <div class="field">
                    <label>Service Type</label>
                    <span>${booking.service_type || 'Photography'}</span>
                  </div>
                  <div class="field">
                    <label>Location</label>
                    <span>${booking.location || 'N/A'}</span>
                  </div>
                  <div class="field">
                    <label>Duration</label>
                    <span>${booking.duration_hours || 'N/A'} Hours</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            ${booking.notes ? `
            <div class="section">
              <div class="section-header">Special Notes</div>
              <div class="section-body">
                <div class="notes-box">
                  ${booking.notes}
                </div>
              </div>
            </div>
            ` : ''}

            <!-- Total -->
            <div class="total-box">
              <div class="total-label">TOTAL AMOUNT</div>
              <div class="total-amount">LKR ${(booking.amount || 0).toLocaleString()}</div>
            </div>

            <div class="thank-you">
              Thank you for choosing Ambiance Photography Studio. We look forward to capturing your timeless moments.
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-links">
              <span>ambiance.lk</span>
              <span>www.ambiance.lk</span>
              <span>studioambiance.lk</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20">
        <p className="text-gray-400">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-400">Booking not found.</p>
          <Link to="/admin/bookings" className="text-yellow-400 hover:text-yellow-300">Back to Bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/admin/bookings" className="text-sm text-gray-400 hover:text-yellow-500">? Back to Bookings</Link>

        <Card className="mt-6 p-8 border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black">
          <h1 className="text-2xl font-serif text-yellow-500 mb-4">Edit Booking #{booking.booking_number || booking.id}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Service Type</Label>
              <Input
                value={form.serviceType}
                onChange={(e) => setForm((f) => ({ ...f, serviceType: e.target.value }))}
                placeholder="Photography, Cinematography, DJ, etc."
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label>Event Date</Label>
              <Input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label>Event Time</Label>
              <Input
                type="time"
                value={form.eventTime}
                onChange={(e) => setForm((f) => ({ ...f, eventTime: e.target.value }))}
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Venue address"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="Amount"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-lg bg-gray-900 border border-gray-800 text-white p-2"
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="bg-gray-900 border-gray-800 text-white"
            />
          </div>

          <div className="flex justify-between gap-3 mt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint} className="border-yellow-600 text-yellow-500 hover:bg-yellow-600/10">
                <Printer className="size-4 mr-2" />
                Print Document
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDelete}>
                Delete Booking
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
