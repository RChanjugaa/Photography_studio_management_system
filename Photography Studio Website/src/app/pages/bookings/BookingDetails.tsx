import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { bookingsAPI } from '../../../services/api';
import { toast } from 'sonner';

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
            <Button variant="destructive" onClick={handleDelete}>
              Delete Booking
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
