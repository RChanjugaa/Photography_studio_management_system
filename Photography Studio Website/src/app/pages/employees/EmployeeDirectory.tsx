import { Search, Users, Camera, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';

export default function EmployeeDirectory() {
  const employees = [
    { 
      id: '1', 
      name: 'Sarah Williams', 
      role: 'Lead Photographer', 
      specialty: 'Wedding Photography',
      rating: 4.9,
      projects: 120,
      description: 'Specializing in elegant wedding photography with 8+ years of experience',
    },
    { 
      id: '2', 
      name: 'Mike Chen', 
      role: 'Senior Photographer', 
      specialty: 'Corporate Events',
      rating: 4.8,
      projects: 95,
      description: 'Expert in corporate and commercial photography',
    },
    { 
      id: '3', 
      name: 'David Park', 
      role: 'Photographer', 
      specialty: 'Studio Portraits',
      rating: 4.7,
      projects: 78,
      description: 'Creating stunning studio portraits and creative concepts',
    },
    { 
      id: '4', 
      name: 'Emma Rodriguez', 
      role: 'Photo Editor', 
      specialty: 'Retouching & Color Grading',
      rating: 5.0,
      projects: 200,
      description: 'Professional photo editing and retouching specialist',
    },
    { 
      id: '5', 
      name: 'Raj Patel', 
      role: 'Photographer', 
      specialty: 'Outdoor Sessions',
      rating: 4.9,
      projects: 85,
      description: 'Expert in outdoor and nature photography',
    },
    { 
      id: '6', 
      name: 'Lisa Wong', 
      role: 'Event Coordinator', 
      specialty: 'Event Management',
      rating: 4.8,
      projects: 110,
      description: 'Planning and coordinating memorable events',
    },
  ];
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Meet Our Team</h1>
            <p className="text-xl text-gray-700">
              A talented group of photographers and creatives dedicated to capturing your special moments
            </p>
          </div>
        </div>
      </section>
      
      {/* Search */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <Input type="text" placeholder="Search team members by name or specialty..." className="pl-10" />
          </div>
        </div>
      </section>
      
      {/* Team Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {employees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 group-hover:from-amber-600/20 group-hover:to-orange-600/20 transition-all" />
                  <Avatar className="size-32 mx-auto mb-4 border-4 border-white shadow-lg relative z-10">
                    <AvatarFallback className="bg-white text-amber-600 text-3xl font-bold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 relative z-10">{employee.name}</h3>
                  <Badge className="mb-2 bg-amber-600 text-white relative z-10">{employee.role}</Badge>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Specialty</span>
                      <Camera className="size-4 text-amber-600" />
                    </div>
                    <div className="font-medium text-gray-900">{employee.specialty}</div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{employee.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{employee.rating}</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{employee.projects}</div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                  </div>
                  
                  <Link to={`/employees/${employee.id}`}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Join Our Team?</h2>
          <p className="text-xl text-gray-300 mb-8">
            We're always looking for talented photographers and creative professionals
          </p>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-10">
            <Mail className="size-5 mr-2" />
            careers@studiopro.lk
          </Button>
        </div>
      </section>
    </div>
  );
}