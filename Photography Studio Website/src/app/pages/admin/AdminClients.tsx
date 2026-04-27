import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, UserCheck, UserX, Mail, Phone, Calendar, X, Shield, ShieldCheck, Printer, AlertCircle, ChevronDown, Check, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import AdminNavigation from '../../components/AdminNavigation';
import { clientsAPI } from '../../../services/api';
import { format } from 'date-fns';

// Mock client data
const mockClients = [
  {
    id: 1,
    firstName: 'Nimal',
    lastName: 'Fernando',
    email: 'nimal.fernando@email.com',
    phone: '+94 77 345 6789',
    status: 'active',
    registrationDate: '2024-01-15',
    lastLogin: '2024-03-20',
    totalBookings: 3,
    totalSpent: 250000,
    profileComplete: true,
    emailVerified: true
  },
  {
    id: 2,
    firstName: 'Priya',
    lastName: 'Rajapaksa',
    email: 'priya.rajapaksa@email.com',
    phone: '+94 77 456 7890',
    status: 'active',
    registrationDate: '2024-02-20',
    lastLogin: '2024-03-18',
    totalBookings: 1,
    totalSpent: 150000,
    profileComplete: true,
    emailVerified: true
  },
  {
    id: 3,
    firstName: 'Sanjay',
    lastName: 'Kumar',
    email: 'sanjay.kumar@email.com',
    phone: '+94 77 567 8901',
    status: 'inactive',
    registrationDate: '2023-12-10',
    lastLogin: '2024-02-15',
    totalBookings: 2,
    totalSpent: 180000,
    profileComplete: false,
    emailVerified: false
  },
  {
    id: 4,
    firstName: 'Dilini',
    lastName: 'Weerasinghe',
    email: 'dilini.weerasinghe@email.com',
    phone: '+94 77 678 9012',
    status: 'pending',
    registrationDate: '2024-03-15',
    lastLogin: null,
    totalBookings: 0,
    totalSpent: 0,
    profileComplete: false,
    emailVerified: false
  }
];

export default function AdminClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('a-z');
  const [dateFilter, setDateFilter] = useState('all');
  const [showClientDrawer, setShowClientDrawer] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [todayFollowUps, setTodayFollowUps] = useState<any[]>([]);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedClientForFollowUp, setSelectedClientForFollowUp] = useState<any>(null);
  const [editingFollowUp, setEditingFollowUp] = useState<any>(null);
  const [followUpForm, setFollowUpForm] = useState({
    note: '',
    followUpDate: new Date().toISOString().split('T')[0],
    priority: 'medium'
  });

  // Check admin authentication + load clients
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
      return;
    }
    fetchClients();
    fetchFollowUps();
    fetchTodayFollowUps();
  }, [navigate]);

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const response = await clientsAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        const normalized = response.data.map((client: any) => ({
          id: client.id,
          firstName: client.first_name || client.firstName,
          lastName: client.last_name || client.lastName,
          email: client.email,
          phone: client.phone,
          status: client.status,
          registrationDate: client.registration_date || client.registrationDate,
          lastLogin: client.last_login || client.lastLogin,
          totalBookings: client.total_bookings || client.totalBookings || 0,
          totalSpent: client.total_spent || client.totalSpent || 0,
          profileComplete: client.profile_complete === 1 || client.profileComplete === true,
          emailVerified: client.email_verified === 1 || client.emailVerified === true,
        }));
        setClients(normalized);
      } else {
        toast.error(response.message || 'Failed to load clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Could not connect to server');
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchFollowUps = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/followups');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setFollowUps(data.data);
      }
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  const fetchTodayFollowUps = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/followups/today');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setTodayFollowUps(data.data);
      }
    } catch (error) {
      console.error('Error fetching today follow-ups:', error);
    }
  };

  // Client form state
  const [clientForm, setClientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active'
  });

  // Filter clients based on search and status
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = `${client.firstName} ${client.lastName} ${client.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      // Date filter for last login
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const today = new Date();
        const clientDate = new Date(client.lastLogin);
        const daysDiff = Math.floor((today.getTime() - clientDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'today') matchesDate = daysDiff === 0;
        if (dateFilter === '7days') matchesDate = daysDiff >= 0 && daysDiff <= 7;
        if (dateFilter === 'overdue') matchesDate = daysDiff > 7 && client.lastLogin;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'a-z') {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      } else if (sortBy === 'z-a') {
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      }
      return 0;
    });

  const handleEditClient = (client: any) => {
    setCurrentClient(client);
    setClientForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      status: client.status
    });
    setIsEditing(true);
    setShowClientDrawer(true);
  };

  const handleSaveClient = async () => {
    if (!clientForm.firstName || !clientForm.lastName || !clientForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      firstName: clientForm.firstName,
      lastName: clientForm.lastName,
      email: clientForm.email,
      phone: clientForm.phone,
      status: clientForm.status,
    };

    try {
      if (isEditing && currentClient?.id) {
        const response = await clientsAPI.update(currentClient.id, payload);
        if (response.success) {
          setClients(clients.map((client) =>
            client.id === currentClient.id ? { ...client, ...payload } : client
          ));
          toast.success('Client updated successfully');
        } else {
          toast.error(response.message || 'Failed to update client');
        }
      } else {
        const response = await clientsAPI.create(payload);
        if (response.success) {
          const newClient = {
            id: response.data?.id || (Math.max(0, ...clients.map((c) => Number(c.id))) + 1),
            ...payload,
            registrationDate: new Date().toISOString().split('T')[0],
            lastLogin: null,
            totalBookings: 0,
            totalSpent: 0,
            profileComplete: false,
            emailVerified: false,
          };
          setClients([...clients, newClient]);
          toast.success('Client added successfully');
        } else {
          toast.error(response.message || 'Failed to create client');
        }
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Unable to save client');
    } finally {
      setShowClientDrawer(false);
      setCurrentClient(null);
      setIsEditing(false);
      setClientForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'active'
      });
    }
  };

  const handleDeleteClient = (clientId: number) => {
    setClients(clients.filter(client => client.id !== clientId));
    toast.success('Client deleted successfully');
  };

  const toggleClientStatus = (clientId: number) => {
    setClients(clients.map(client =>
      client.id === clientId
        ? { ...client, status: client.status === 'active' ? 'inactive' : 'active' }
        : client
    ));
    toast.success('Client status updated');
  };

  const handleAddFollowUp = (client: any) => {
    setSelectedClientForFollowUp(client);
    setEditingFollowUp(null);
    setFollowUpForm({ note: '', followUpDate: new Date().toISOString().split('T')[0], priority: 'medium' });
    setShowFollowUpModal(true);
  };

  const handleEditFollowUp = (followUp: any) => {
    setEditingFollowUp(followUp);
    setFollowUpForm({
      note: followUp.note,
      followUpDate: followUp.follow_up_date?.split('T')[0] || '',
      priority: followUp.priority
    });
    setShowFollowUpModal(true);
  };

  const handleSaveFollowUp = async () => {
    if (!followUpForm.note.trim() || !followUpForm.followUpDate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingFollowUp?.id) {
        // Update
        const response = await fetch(`http://localhost:5000/api/followups/${editingFollowUp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            note: followUpForm.note,
            follow_up_date: followUpForm.followUpDate,
            priority: followUpForm.priority,
            status: editingFollowUp.status
          })
        });
        if (response.ok) {
          toast.success('Follow-up updated');
          await fetchFollowUps();
          setShowFollowUpModal(false);
        }
      } else {
        // Create
        const response = await fetch('http://localhost:5000/api/followups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: selectedClientForFollowUp.id,
            note: followUpForm.note,
            follow_up_date: followUpForm.followUpDate,
            priority: followUpForm.priority,
            status: 'pending'
          })
        });
        if (response.ok) {
          toast.success('Follow-up created');
          await fetchFollowUps();
          await fetchTodayFollowUps();
          setShowFollowUpModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving follow-up:', error);
      toast.error('Failed to save follow-up');
    }
  };

  const handleDeleteFollowUp = async (followUpId: number) => {
    if (!confirm('Delete this follow-up?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/followups/${followUpId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Follow-up deleted');
        await fetchFollowUps();
        await fetchTodayFollowUps();
      }
    } catch (error) {
      console.error('Error deleting follow-up:', error);
      toast.error('Failed to delete follow-up');
    }
  };

  const handleMarkDone = async (followUpId: number) => {
    try {
      const followUp = followUps.find(f => f.id === followUpId);
      if (!followUp) return;

      const response = await fetch(`http://localhost:5000/api/followups/${followUpId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...followUp, status: 'completed' })
      });
      if (response.ok) {
        toast.success('Follow-up marked as done');
        await fetchFollowUps();
        await fetchTodayFollowUps();
      }
    } catch (error) {
      console.error('Error marking follow-up done:', error);
      toast.error('Failed to update follow-up');
    }
  };

  const getClientFollowUps = (clientId: number) => {
    return followUps.filter(f => f.client_id === clientId);
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-900/30 text-red-400 border-red-800';
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
      case 'low': return 'bg-green-900/30 text-green-400 border-green-800';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-800';
    }
  };

  const handlePrintClient = (client: any) => {
    const documentDate = format(new Date(), 'MMMM dd, yyyy');
    const registrationDate = format(new Date(client.registrationDate), 'MMMM dd, yyyy');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Client Profile - ${client.firstName} ${client.lastName}</title>
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

          .profile-title {
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

          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .status-active { background: #198754; color: white; }
          .status-inactive { background: #6c757d; color: white; }
          .status-pending { background: #ffc107; color: #1a1a1a; }

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
            <div class="profile-title">Client Profile Report</div>

            <!-- Document meta -->
            <div class="doc-meta">
              <div><strong>Document Date:</strong> ${documentDate}</div>
              <div><strong>Client ID:</strong> CLT-${client.id}</div>
              <div><strong>Status:</strong> <span class="status-badge status-${client.status}">${client.status.toUpperCase()}</span></div>
            </div>

            <!-- Client Information -->
            <div class="section">
              <div class="section-header">Client Information</div>
              <div class="section-body">
                <div class="grid-2">
                  <div class="field">
                    <label>First Name</label>
                    <span>${client.firstName}</span>
                  </div>
                  <div class="field">
                    <label>Last Name</label>
                    <span>${client.lastName}</span>
                  </div>
                  <div class="field">
                    <label>Email Address</label>
                    <span>${client.email}</span>
                  </div>
                  <div class="field">
                    <label>Phone Number</label>
                    <span>${client.phone || 'N/A'}</span>
                  </div>
                  <div class="field">
                    <label>Registration Date</label>
                    <span>${registrationDate}</span>
                  </div>
                  <div class="field">
                    <label>Last Login</label>
                    <span>${client.lastLogin ? format(new Date(client.lastLogin), 'MMMM dd, yyyy') : 'Never'}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Client Statistics -->
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Total Bookings</div>
                <div class="stat-value">${client.totalBookings}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Total Spent</div>
                <div class="stat-value">Rs. ${client.totalSpent.toLocaleString()}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Account Status</div>
                <div class="stat-value" style="font-size: 12px;">${client.status.toUpperCase()}</div>
              </div>
            </div>

            <!-- Verification Status -->
            <div class="section">
              <div class="section-header">Account Verification</div>
              <div class="section-body">
                <div class="grid-2">
                  <div class="field">
                    <label>Email Verified</label>
                    <span>${client.emailVerified ? '✓ Yes' : '✗ No'}</span>
                  </div>
                  <div class="field">
                    <label>Profile Complete</label>
                    <span>${client.profileComplete ? '✓ Yes' : '✗ No'}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="total-box">
              <div class="total-label">CLIENT ACCOUNT SUMMARY</div>
              <div class="total-amount">${client.status.charAt(0).toUpperCase() + client.status.slice(1)}</div>
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-900/30 text-green-400 border-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-900/30 text-gray-400 border-gray-800">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const clientStats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    pending: clients.filter(c => c.status === 'pending').length,
    verified: clients.filter(c => c.emailVerified).length
  };

  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-yellow-500 mb-2 uppercase">Client Management</h1>
            <p className="text-gray-400">Manage client accounts, login status, and registration details</p>
          </div>

          {/* Follow-up Alert Banner */}
          {todayFollowUps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="size-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300">
                ⚠️ <strong>{todayFollowUps.length}</strong> follow-up{todayFollowUps.length > 1 ? 's' : ''} pending today
              </p>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Clients</p>
                  <p className="text-2xl font-bold text-blue-400">{clientStats.total}</p>
                </div>
                <UserCheck className="size-10 text-blue-400" />
              </div>
            </Card>
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active</p>
                  <p className="text-2xl font-bold text-green-400">{clientStats.active}</p>
                </div>
                <UserCheck className="size-10 text-green-400" />
              </div>
            </Card>
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Inactive</p>
                  <p className="text-2xl font-bold text-gray-400">{clientStats.inactive}</p>
                </div>
                <UserX className="size-10 text-gray-400" />
              </div>
            </Card>
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{clientStats.pending}</p>
                </div>
                <Calendar className="size-10 text-yellow-400" />
              </div>
            </Card>
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Verified</p>
                  <p className="text-2xl font-bold text-purple-400">{clientStats.verified}</p>
                </div>
                <ShieldCheck className="size-10 text-purple-400" />
              </div>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-36 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="a-z">A–Z</SelectItem>
                <SelectItem value="z-a">Z–A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Date filter" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentClient(null);
                setClientForm({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  status: 'active'
                });
                setShowClientDrawer(true);
              }}
              className="bg-red-700 hover:bg-red-800"
            >
              <Plus className="size-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Clients Table */}
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-gray-400 font-medium">Client</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Contact</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Registration</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Last Login</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Bookings</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.flatMap((client) => [
                    <motion.tr key={client.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{client.firstName[0]}{client.lastName[0]}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{client.firstName} {client.lastName}</p>
                            <p className="text-gray-400 text-sm">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="size-4" />
                          {client.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(client.status)}</td>
                      <td className="px-6 py-4 text-gray-300">{new Date(client.registrationDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-300">{client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : 'Never'}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">
                          <p className="font-medium">{client.totalBookings} bookings</p>
                          <p className="text-sm text-gray-400">Rs. {client.totalSpent.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleAddFollowUp(client)} className="border-blue-700 text-blue-400 hover:bg-blue-900/20"><Clock className="size-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setExpandedClientId(expandedClientId === client.id ? null : client.id)} className="border-gray-700 text-gray-300 hover:bg-gray-800"><ChevronDown className="size-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handlePrintClient(client)} className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"><Printer className="size-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditClient(client)} className="border-gray-700 text-gray-300 hover:bg-gray-800"><Edit className="size-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => toggleClientStatus(client.id)} className={`border-gray-700 hover:bg-gray-800 ${client.status === 'active' ? 'text-red-400' : 'text-green-400'}`}>{client.status === 'active' ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteClient(client.id)} className="border-red-700 text-red-400 hover:bg-red-900"><Trash2 className="size-4" /></Button>
                        </div>
                      </td>
                    </motion.tr>,
                    ...(expandedClientId === client.id ? [
                      <motion.tr key={`${client.id}-followups`} className="bg-gray-900/50 border-b border-gray-800/50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-300">Follow-ups</h4>
                            {getClientFollowUps(client.id).length === 0 ? (
                              <p className="text-sm text-gray-500">No follow-ups</p>
                            ) : (
                              <div className="space-y-2">
                                {getClientFollowUps(client.id).map((followUp) => (
                                  <div key={followUp.id} className="flex items-start justify-between bg-gray-800/50 p-3 rounded border border-gray-700 text-sm">
                                    <div className="flex-1">
                                      <p className="text-gray-300">{followUp.note}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">{new Date(followUp.follow_up_date).toLocaleDateString()}</span>
                                        <Badge className={`${getPriorityBadgeColor(followUp.priority)} text-xs`}>{followUp.priority}</Badge>
                                        <Badge className={followUp.status === 'completed' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}>{followUp.status}</Badge>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {followUp.status !== 'completed' && <Button size="sm" variant="ghost" onClick={() => handleMarkDone(followUp.id)} className="text-green-400"><Check className="size-4" /></Button>}
                                      <Button size="sm" variant="ghost" onClick={() => handleEditFollowUp(followUp)} className="text-gray-400"><Edit className="size-3" /></Button>
                                      <Button size="sm" variant="ghost" onClick={() => handleDeleteFollowUp(followUp.id)} className="text-red-400"><Trash2 className="size-3" /></Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ] : [])
                  ])}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Client Drawer */}
          <AnimatePresence>
            {showClientDrawer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowClientDrawer(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 w-full max-w-md"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif text-yellow-500 uppercase">
                      {isEditing ? 'Edit Client' : 'Add New Client'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowClientDrawer(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                      <Input
                        id="firstName"
                        value={clientForm.firstName}
                        onChange={(e) => setClientForm({...clientForm, firstName: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={clientForm.lastName}
                        onChange={(e) => setClientForm({...clientForm, lastName: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clientForm.email}
                        onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                      <Input
                        id="phone"
                        value={clientForm.phone}
                        onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select value={clientForm.status} onValueChange={(value) => setClientForm({...clientForm, status: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleSaveClient}
                      className="flex-1 bg-red-700 hover:bg-red-800"
                    >
                      {isEditing ? 'Update Client' : 'Add Client'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowClientDrawer(false)}
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Follow-up Modal */}
          <AnimatePresence>
            {showFollowUpModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowFollowUpModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 w-full max-w-md"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif text-yellow-500 uppercase">
                      {editingFollowUp ? 'Edit Follow-up' : 'Add Follow-up'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFollowUpModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  {selectedClientForFollowUp && (
                    <p className="text-sm text-gray-400 mb-4">
                      for <strong className="text-gray-300">{selectedClientForFollowUp.firstName} {selectedClientForFollowUp.lastName}</strong>
                    </p>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="note" className="text-gray-300">Note *</Label>
                      <textarea
                        id="note"
                        value={followUpForm.note}
                        onChange={(e) => setFollowUpForm({...followUpForm, note: e.target.value})}
                        placeholder="Add follow-up note..."
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 mt-1 text-sm resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date" className="text-gray-300">Follow-up Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={followUpForm.followUpDate}
                        onChange={(e) => setFollowUpForm({...followUpForm, followUpDate: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                      <Select value={followUpForm.priority} onValueChange={(value) => setFollowUpForm({...followUpForm, priority: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleSaveFollowUp}
                      className="flex-1 bg-red-700 hover:bg-red-800"
                    >
                      {editingFollowUp ? 'Update' : 'Create'} Follow-up
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowFollowUpModal(false)}
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}