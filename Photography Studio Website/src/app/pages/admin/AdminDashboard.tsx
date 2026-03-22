import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Users, DollarSign, Calendar, TrendingUp, UserCheck, UserX, Eye, Briefcase, ImageIcon } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import AdminNavigation from '../../components/AdminNavigation';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin login required.');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const stats = [
    { label: 'Total Employees', value: '12', icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-800' },
    { label: 'Total Events', value: '4', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-800' },
    { label: 'Photo Galleries', value: '24', icon: ImageIcon, color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-800' },
    { label: 'Revenue (Month)', value: 'Rs. 450K', icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-800' },
  ];
  
  const quickActions = [
    { label: 'Manage Employees', description: 'Add, edit, or remove staff members', icon: Users, link: '/admin/employees', color: 'bg-red-700' },
    { label: 'Manage Events', description: 'Create and manage photography events', icon: Calendar, link: '/admin/events', color: 'bg-purple-700' },
    { label: 'Photo Galleries', description: 'Upload and deliver client photos', icon: ImageIcon, link: '/gallery', color: 'bg-green-700' },
    { label: 'Payments & Invoices', description: 'Record payments and generate invoices', icon: DollarSign, link: '/admin/payments', color: 'bg-blue-700' },
  ];
  
  const recentActivity = [
    { action: 'Added new employee', user: 'Nimal Perera', time: '2 hours ago', type: 'create' },
    { action: 'Updated salary', user: 'Amaya Silva', time: '5 hours ago', type: 'update' },
    { action: 'Assigned task', user: 'Kasun Fernando', time: '1 day ago', type: 'assign' },
    { action: 'Toggled visibility', user: 'Dinesh Kumar', time: '2 days ago', type: 'visibility' },
  ];
  
  const upcomingTasks = [
    { title: 'Silva-Perera Wedding', assignee: 'Amaya Silva', date: '2024-03-25', priority: 'high' },
    { title: 'Corporate Event - Dialog', assignee: 'Kasun Fernando', date: '2024-03-28', priority: 'medium' },
    { title: 'Birthday Party', assignee: 'Nadeeka Perera', date: '2024-03-30', priority: 'low' },
  ];
  
  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-yellow-500 mb-2 uppercase">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {localStorage.getItem('userName') || 'Admin'}</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${stat.border} ${stat.bg} p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`size-12 ${stat.color}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-yellow-500 mb-4 uppercase">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link to={action.link}>
                    <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6 hover:border-yellow-500 transition-all duration-300 group cursor-pointer">
                      <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="size-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">{action.label}</h3>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h2 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-800 last:border-0">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'create' ? 'bg-green-900/30' :
                        activity.type === 'update' ? 'bg-blue-900/30' :
                        activity.type === 'assign' ? 'bg-purple-900/30' :
                        'bg-yellow-900/30'
                      }`}>
                        {activity.type === 'create' && <Users className="size-5 text-green-400" />}
                        {activity.type === 'update' && <DollarSign className="size-5 text-blue-400" />}
                        {activity.type === 'assign' && <Calendar className="size-5 text-purple-400" />}
                        {activity.type === 'visibility' && <Eye className="size-5 text-yellow-400" />}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-gray-400 text-sm">{activity.user}</p>
                    </div>
                    <span className="text-gray-500 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Upcoming Tasks */}
            <Card className="border-2 border-gray-800 bg-gradient-to-br from-[#2a0f0f] to-black p-6">
              <h2 className="text-2xl font-serif text-yellow-500 mb-6 uppercase">Upcoming Tasks</h2>
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold">{task.title}</h4>
                      <Badge className={
                        task.priority === 'high' ? 'bg-red-900/30 text-red-300 border-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' :
                        'bg-gray-800 text-gray-400'
                      }>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{task.assignee}</p>
                    <p className="text-gray-500 text-xs">{task.date}</p>
                  </div>
                ))}
              </div>
              <Link to="/admin/employees">
                <Button className="w-full mt-4 bg-red-700 hover:bg-red-800 text-white">
                  View All Tasks
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}