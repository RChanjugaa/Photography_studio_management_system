import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, TrendingUp, DollarSign, AlertCircle, Calendar, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import AdminNavigation from '../../components/AdminNavigation';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for charts
const monthlyRevenueData = [
  { month: 'Jan', revenue: 450000, target: 400000 },
  { month: 'Feb', revenue: 520000, target: 450000 },
  { month: 'Mar', revenue: 350000, target: 500000 },
  { month: 'Apr', revenue: 0, target: 500000 },
];

const paymentMethodData = [
  { name: 'Cash', value: 125000, count: 3 },
  { name: 'Bank Transfer', value: 200000, count: 5 },
  { name: 'Card', value: 80000, count: 2 },
  { name: 'Online', value: 45000, count: 1 },
];

const packageRevenueData = [
  { package: 'Wedding Premium', revenue: 480000, bookings: 4 },
  { package: 'Wedding Standard', revenue: 240000, bookings: 2 },
  { package: 'Birthday Package', revenue: 80000, bookings: 2 },
  { package: 'Corporate Events', revenue: 350000, bookings: 3 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function AdminFinanceReports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const stats = [
    { 
      label: 'Total Revenue (This Period)', 
      value: 'Rs. 1,320,000', 
      change: '+12.5%',
      icon: DollarSign, 
      color: 'text-green-400', 
      bg: 'bg-green-900/30', 
      border: 'border-green-800',
      changeColor: 'text-green-400'
    },
    { 
      label: 'Payments Received', 
      value: 'Rs. 450,000', 
      change: '+8.2%',
      icon: TrendingUp, 
      color: 'text-blue-400', 
      bg: 'bg-blue-900/30', 
      border: 'border-blue-800',
      changeColor: 'text-blue-400'
    },
    { 
      label: 'Outstanding Balance', 
      value: 'Rs. 245,000', 
      change: '-5.1%',
      icon: Calendar, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-900/30', 
      border: 'border-yellow-800',
      changeColor: 'text-yellow-400'
    },
    { 
      label: 'Overdue Invoices', 
      value: '1 (Rs. 90,000)', 
      change: 'Needs attention',
      icon: AlertCircle, 
      color: 'text-red-400', 
      bg: 'bg-red-900/30', 
      border: 'border-red-800',
      changeColor: 'text-red-400'
    },
  ];
  
  const handleExportReport = () => {
    toast.success('Exporting financial report...');
  };
  
  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/admin/payments">
                <Button variant="outline" className="mb-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Payments
                </Button>
              </Link>
              <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Finance Reports</h1>
              <p className="text-gray-400">Revenue analytics and financial insights</p>
            </div>
            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExportReport}
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${stat.border} ${stat.bg} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <stat.icon className={`size-10 ${stat.color}`} />
                    <span className={`text-sm font-semibold ${stat.changeColor}`}>{stat.change}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Revenue Line Chart */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h3 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Actual Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Payment Method Pie Chart */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h3 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Payment Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: any) => `Rs. ${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
          
          {/* Revenue by Package Bar Chart */}
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6 mb-8">
            <h3 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Revenue by Package</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={packageRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="package" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                  formatter={(value: any) => `Rs. ${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="bookings" fill="#f59e0b" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          
          {/* Summary Table */}
          <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-2xl font-serif text-yellow-500 uppercase">Payment Method Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Total Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Transactions</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-500 uppercase">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {paymentMethodData.map((method, index) => {
                    const total = paymentMethodData.reduce((sum, m) => sum + m.value, 0);
                    const percentage = ((method.value / total) * 100).toFixed(1);
                    
                    return (
                      <tr key={method.name} className="hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-white font-semibold">{method.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-semibold">Rs. {method.value.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white">{method.count}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-grow bg-gray-800 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${percentage}%`, 
                                  backgroundColor: COLORS[index] 
                                }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold w-12">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
