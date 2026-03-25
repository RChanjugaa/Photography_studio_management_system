import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Calendar, User, X } from 'lucide-react';
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
import { employeesAPI } from '../../../services/api';

// Mock employee data
const mockEmployees = [
  {
    id: 1,
    firstName: 'Amaya',
    lastName: 'Silva',
    email: 'amaya@ambiance.lk',
    phone: '+94 77 123 4567',
    role: 'Lead Photographer',
    status: 'active',
    visiblePublic: true,
    joinDate: '2016-03-15',
    lastLogin: '2024-03-10',
    bio: 'Specialized in wedding and portrait photography.',
    specialties: ['Weddings', 'Portraits'],
    baseSalary: 120000
  },
  {
    id: 2,
    firstName: 'Kasun',
    lastName: 'Perera',
    email: 'kasun@ambiance.lk',
    phone: '+94 77 234 5678',
    role: 'Cinematographer',
    status: 'active',
    visiblePublic: true,
    joinDate: '2018-07-20',
    lastLogin: '2024-03-09',
    bio: 'Creating cinematic wedding films.',
    specialties: ['Cinematography', 'Events'],
    baseSalary: 100000
  }
];

export default function AdminEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEmployeeDrawer, setShowEmployeeDrawer] = useState(false);
  const [showSalaryDrawer, setShowSalaryDrawer] = useState(false);
  const [showTaskDrawer, setShowTaskDrawer] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Check admin authentication + load employees
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
      return;
    }
    fetchEmployees();
  }, [navigate]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await employeesAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        const normalized = response.data.map((emp: any) => ({
          id: emp.id,
          firstName: emp.first_name || emp.firstName,
          lastName: emp.last_name || emp.lastName,
          email: emp.email,
          phone: emp.phone,
          role: emp.role,
          status: emp.status,
          visiblePublic: emp.visible_public === 1 || emp.visible_public === true,
          joinDate: emp.join_date || emp.joinDate,
          lastLogin: emp.last_login || emp.lastLogin || '-',
          bio: emp.bio || '',
          specialties: emp.specialties ? (typeof emp.specialties === 'string' ? JSON.parse(emp.specialties) : emp.specialties) : [],
          baseSalary: emp.base_salary || emp.baseSalary || 0,
        }));
        setEmployees(normalized);
      } else {
        toast.error(response.message || 'Failed to load employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Could not connect to server');
    } finally {
      setLoadingEmployees(false);
    }
  };
  
  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    visiblePublic: false,
    bio: '',
    specialties: '',
    joinDate: ''
  });
  
  // Salary form state
  const [salaryForm, setSalaryForm] = useState({
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    payCycle: 'monthly',
    effectiveFrom: ''
  });
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    targetType: 'booking',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    priority: 'medium',
    notes: ''
  });
  
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || emp.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsEditing(false);
    setEmployeeForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      status: 'active',
      visiblePublic: false,
      bio: '',
      specialties: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setShowEmployeeDrawer(true);
  };
  
  const handleEditEmployee = (employee: any) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
    setEmployeeForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      status: employee.status,
      visiblePublic: employee.visiblePublic,
      bio: employee.bio,
      specialties: employee.specialties.join(', '),
      joinDate: employee.joinDate
    });
    setShowEmployeeDrawer(true);
  };
  
  const handleSaveEmployee = async () => {
    if (!employeeForm.firstName || !employeeForm.lastName || !employeeForm.email || !employeeForm.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      firstName: employeeForm.firstName,
      lastName: employeeForm.lastName,
      email: employeeForm.email,
      phone: employeeForm.phone,
      role: employeeForm.role,
      status: employeeForm.status,
      visiblePublic: employeeForm.visiblePublic,
      joinDate: employeeForm.joinDate,
      bio: employeeForm.bio,
      specialties: employeeForm.specialties.split(',').map((s) => s.trim()),
      baseSalary: employeeForm.baseSalary || 0,
    };

    try {
      if (isEditing && currentEmployee?.id) {
        const response = await employeesAPI.update(currentEmployee.id, payload);
        if (response.success) {
          setEmployees(employees.map((emp) =>
            emp.id === currentEmployee.id ? { ...emp, ...payload, specialties: payload.specialties } : emp
          ));
          toast.success('Employee updated successfully');
        } else {
          toast.error(response.message || 'Failed to update employee');
        }
      } else {
        const response = await employeesAPI.create(payload);
        if (response.success) {
          const newEmployee = {
            id: response.data?.id || (Math.max(0, ...employees.map((e) => Number(e.id))) + 1),
            ...payload,
            lastLogin: '-',
          };
          setEmployees([...employees, newEmployee]);
          toast.success('Employee added successfully');
        } else {
          toast.error(response.message || 'Failed to create employee');
        }
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Unable to save employee');
    } finally {
      setShowEmployeeDrawer(false);
    }
  };
  
  const handleToggleVisibility = async (id: number) => {
    const target = employees.find((emp) => emp.id === id);
    if (!target) return;

    try {
      const payload = { ...target, visiblePublic: !target.visiblePublic };
      const response = await employeesAPI.update(id, payload);
      if (response.success) {
        setEmployees(employees.map((emp) =>
          emp.id === id ? { ...emp, visiblePublic: !target.visiblePublic } : emp
        ));
        toast.success('Visibility updated');
      } else {
        toast.error(response.message || 'Failed to update visibility');
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      toast.error('Error updating visibility');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await employeesAPI.delete(id);
      if (response.success) {
        setEmployees(employees.filter((emp) => emp.id !== id));
        toast.success('Employee deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast.error('Error deleting employee');
    }
  };

  const handleManageSalary = (employee: any) => {
    setCurrentEmployee(employee);
    setSalaryForm({
      baseSalary: employee.baseSalary || 0,
      allowances: 0,
      deductions: 0,
      payCycle: 'monthly',
      effectiveFrom: new Date().toISOString().split('T')[0]
    });
    setShowSalaryDrawer(true);
  };
  
  const handleSaveSalary = async () => {
    if (!currentEmployee) return;

    const payload = {
      ...currentEmployee,
      baseSalary: salaryForm.baseSalary
    };

    try {
      const response = await employeesAPI.update(currentEmployee.id, payload);
      if (response.success) {
        setEmployees(employees.map((emp) =>
          emp.id === currentEmployee.id ? { ...emp, baseSalary: salaryForm.baseSalary } : emp
        ));
        toast.success('Salary updated successfully');
      } else {
        toast.error(response.message || 'Failed to update salary');
      }
    } catch (error) {
      console.error('Failed to update salary:', error);
      toast.error('Error updating salary');
    } finally {
      setShowSalaryDrawer(false);
    }
  };
  
  const handleAssignTask = (employee: any) => {
    setCurrentEmployee(employee);
    setTaskForm({
      title: '',
      targetType: 'booking',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      priority: 'medium',
      notes: ''
    });
    setShowTaskDrawer(true);
  };
  
  const handleSaveTask = () => {
    if (!taskForm.title || !taskForm.startDate) {
      toast.error('Please fill in required fields');
      return;
    }
    
    toast.success(`Task assigned to ${currentEmployee.firstName} ${currentEmployee.lastName}`);
    setShowTaskDrawer(false);
  };
  
  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Employee Management</h1>
              <p className="text-gray-400">Manage team members, salaries, and assignments</p>
            </div>
            <Button
              onClick={handleAddEmployee}
              className="bg-red-700 hover:bg-red-800 text-white mt-4 md:mt-0"
            >
              <Plus className="size-4 mr-2" />
              Add Employee
            </Button>
          </div>
          
          {/* Filters */}
          <div className="grid md:grid-cols-12 gap-4 mb-8">
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 bg-gray-900 border-gray-800 text-white"
                />
              </div>
            </div>
            <div className="md:col-span-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="photographer">Photographers</SelectItem>
                  <SelectItem value="cinematographer">Cinematographers</SelectItem>
                  <SelectItem value="editor">Editors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Employee Table */}
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Visibility</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Last Login</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-yellow-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">{employee.firstName} {employee.lastName}</div>
                          <div className="text-gray-400 text-sm">{employee.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-gray-800 text-gray-300">{employee.role}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={employee.status === 'active' ? 'bg-green-900/30 text-green-300 border-green-800' : 'bg-gray-800 text-gray-400'}>
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVisibility(employee.id)}
                          className="flex items-center gap-2 text-sm"
                        >
                          {employee.visiblePublic ? (
                            <Badge className="bg-blue-900/30 text-blue-300 border-blue-800">
                              <Eye className="size-3 mr-1" />
                              Public
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-800 text-gray-400">
                              <EyeOff className="size-3 mr-1" />
                              Hidden
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{employee.lastLogin}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageSalary(employee)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <DollarSign className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignTask(employee)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Calendar className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="border-red-500 text-red-300 hover:bg-red-800"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Employee Drawer */}
        <AnimatePresence>
          {showEmployeeDrawer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowEmployeeDrawer(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="ml-auto h-full w-full max-w-2xl bg-gradient-to-br from-[#2a0f0f] to-black border-l-2 border-gray-800 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-serif text-yellow-500 uppercase">
                      {isEditing ? 'Edit Employee' : 'Add Employee'}
                    </h2>
                    <button onClick={() => setShowEmployeeDrawer(false)} className="text-gray-400 hover:text-white">
                      <X className="size-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">First Name *</Label>
                        <Input
                          value={employeeForm.firstName}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, firstName: e.target.value })}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Last Name *</Label>
                        <Input
                          value={employeeForm.lastName}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, lastName: e.target.value })}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Email *</Label>
                        <Input
                          type="email"
                          value={employeeForm.email}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Phone</Label>
                        <Input
                          value={employeeForm.phone}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Role *</Label>
                        <Input
                          value={employeeForm.role}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                          placeholder="e.g., Lead Photographer"
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Join Date</Label>
                        <Input
                          type="date"
                          value={employeeForm.joinDate}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, joinDate: e.target.value })}
                          className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Bio</Label>
                      <Textarea
                        value={employeeForm.bio}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, bio: e.target.value })}
                        rows={4}
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Specialties (comma separated)</Label>
                      <Input
                        value={employeeForm.specialties}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, specialties: e.target.value })}
                        placeholder="e.g., Weddings, Portraits, Studio"
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300">Status</Label>
                        <select
                          value={employeeForm.status}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value })}
                          className="mt-1.5 w-full bg-gray-900 border border-gray-800 text-white rounded-md px-3 py-2"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 mt-8">
                        <input
                          type="checkbox"
                          id="visiblePublic"
                          checked={employeeForm.visiblePublic}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, visiblePublic: e.target.checked })}
                          className="w-5 h-5 bg-gray-900 border-gray-800 rounded"
                        />
                        <Label htmlFor="visiblePublic" className="text-gray-300">Publicly Visible</Label>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-6">
                      <Button
                        onClick={() => setShowEmployeeDrawer(false)}
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveEmployee}
                        className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                      >
                        {isEditing ? 'Update' : 'Create'} Employee
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Salary Drawer */}
        <AnimatePresence>
          {showSalaryDrawer && currentEmployee && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowSalaryDrawer(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-2xl bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 rounded-lg p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-serif text-yellow-500 uppercase">
                    Manage Salary - {currentEmployee.firstName} {currentEmployee.lastName}
                  </h2>
                  <button onClick={() => setShowSalaryDrawer(false)} className="text-gray-400 hover:text-white">
                    <X className="size-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Base Salary (LKR)</Label>
                      <Input
                        type="number"
                        value={salaryForm.baseSalary}
                        onChange={(e) => setSalaryForm({ ...salaryForm, baseSalary: Number(e.target.value) })}
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Allowances (LKR)</Label>
                      <Input
                        type="number"
                        value={salaryForm.allowances}
                        onChange={(e) => setSalaryForm({ ...salaryForm, allowances: Number(e.target.value) })}
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Deductions (LKR)</Label>
                      <Input
                        type="number"
                        value={salaryForm.deductions}
                        onChange={(e) => setSalaryForm({ ...salaryForm, deductions: Number(e.target.value) })}
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Pay Cycle</Label>
                      <select
                        value={salaryForm.payCycle}
                        onChange={(e) => setSalaryForm({ ...salaryForm, payCycle: e.target.value })}
                        className="mt-1.5 w-full bg-gray-900 border border-gray-800 text-white rounded-md px-3 py-2"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Effective From</Label>
                    <Input
                      type="date"
                      value={salaryForm.effectiveFrom}
                      onChange={(e) => setSalaryForm({ ...salaryForm, effectiveFrom: e.target.value })}
                      className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-yellow-500">Net Salary:</span>
                      <span className="text-yellow-500">
                        LKR {(salaryForm.baseSalary + salaryForm.allowances - salaryForm.deductions).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-6">
                    <Button
                      onClick={() => setShowSalaryDrawer(false)}
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSalary}
                      className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                    >
                      Save Salary
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Task Assignment Drawer */}
        <AnimatePresence>
          {showTaskDrawer && currentEmployee && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowTaskDrawer(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-2xl bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 rounded-lg p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-serif text-yellow-500 uppercase">
                    Assign Task - {currentEmployee.firstName} {currentEmployee.lastName}
                  </h2>
                  <button onClick={() => setShowTaskDrawer(false)} className="text-gray-400 hover:text-white">
                    <X className="size-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="text-gray-300">Task Title *</Label>
                    <Input
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="e.g., Silva-Perera Wedding"
                      className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Type</Label>
                      <select
                        value={taskForm.targetType}
                        onChange={(e) => setTaskForm({ ...taskForm, targetType: e.target.value })}
                        className="mt-1.5 w-full bg-gray-900 border border-gray-800 text-white rounded-md px-3 py-2"
                      >
                        <option value="booking">Booking</option>
                        <option value="event">Event</option>
                        <option value="ops">Operations</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Priority</Label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        className="mt-1.5 w-full bg-gray-900 border border-gray-800 text-white rounded-md px-3 py-2"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Start Date *</Label>
                      <Input
                        type="date"
                        value={taskForm.startDate}
                        onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Start Time</Label>
                      <Input
                        type="time"
                        value={taskForm.startTime}
                        onChange={(e) => setTaskForm({ ...taskForm, startTime: e.target.value })}
                        className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Location</Label>
                    <Input
                      value={taskForm.location}
                      onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })}
                      placeholder="e.g., Galle Face Hotel"
                      className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Notes</Label>
                    <Textarea
                      value={taskForm.notes}
                      onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                      rows={3}
                      placeholder="Additional details or instructions..."
                      className="mt-1.5 bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-6">
                    <Button
                      onClick={() => setShowTaskDrawer(false)}
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveTask}
                      className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                    >
                      Assign Task
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}