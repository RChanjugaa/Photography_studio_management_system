import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, UserCheck, UserX, Mail, Phone, Calendar, X, Shield, ShieldCheck } from 'lucide-react';
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
  const [showClientDrawer, setShowClientDrawer] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check admin authentication + load clients
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
      return;
    }
    fetchClients();
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

  // Client form state
  const [clientForm, setClientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active'
  });

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = `${client.firstName} ${client.lastName} ${client.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
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
              <SelectTrigger className="w-full sm:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                  {filteredClients.map((client) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-800/50 hover:bg-gray-900/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {client.firstName[0]}{client.lastName[0]}
                            </span>
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
                      <td className="px-6 py-4">
                        {getStatusBadge(client.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(client.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">
                          <p className="font-medium">{client.totalBookings} bookings</p>
                          <p className="text-sm text-gray-400">Rs. {client.totalSpent.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClient(client)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleClientStatus(client.id)}
                            className={`border-gray-700 hover:bg-gray-800 ${
                              client.status === 'active' ? 'text-red-400' : 'text-green-400'
                            }`}
                          >
                            {client.status === 'active' ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClient(client.id)}
                            className="border-red-700 text-red-400 hover:bg-red-900"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
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
        </div>
      </div>
    </>
  );
}