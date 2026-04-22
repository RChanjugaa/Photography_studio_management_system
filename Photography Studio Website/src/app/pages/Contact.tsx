import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };
  
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Photography Lane', 'Colombo 03, Sri Lanka'],
      color: 'from-red-600 to-red-700'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+94 77 123 4567', '+94 11 234 5678'],
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@ambiancestudio.lk', 'bookings@ambiancestudio.lk'],
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: By Appointment'],
      color: 'from-yellow-600 to-yellow-500'
    }
  ];
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#2a0f0f] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif text-yellow-500 mb-6">Get In Touch</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have a question or ready to book your session? We'd love to hear from you. 
              Reach out and let's start creating magic together.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Info Cards */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 hover:border-yellow-500/50 transition-all p-6 h-full text-center group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <info.icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-400 text-sm">{detail}</p>
                  ))}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form & Map */}
      <section className="py-20 bg-gradient-to-b from-black to-[#2a0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="size-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-white">Send Us a Message</h2>
                    <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-300 font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="mt-1.5 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-gray-300 font-medium">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="mt-1.5 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-gray-300 font-medium">
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+94 77 123 4567"
                        className="mt-1.5 h-12 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 font-medium mb-1.5 block">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })} required>
                      <SelectTrigger className="h-12 border-gray-700 bg-black text-white">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="booking" className="text-white hover:bg-gray-800">Booking Inquiry</SelectItem>
                        <SelectItem value="packages" className="text-white hover:bg-gray-800">Package Information</SelectItem>
                        <SelectItem value="custom" className="text-white hover:bg-gray-800">Custom Quote Request</SelectItem>
                        <SelectItem value="general" className="text-white hover:bg-gray-800">General Question</SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-gray-800">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-gray-300 font-medium">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us about your event, preferred dates, or any specific requirements..."
                      className="mt-1.5 border-gray-700 bg-black text-white placeholder:text-gray-600 resize-none focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold text-base"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="size-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
            
            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Map */}
              <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 overflow-hidden h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467128279!2d79.86119931477296!3d6.914678095007648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596d3cb8b2a9%3A0x4a9d8b6c7e9a8d6c!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale"
                ></iframe>
              </Card>
              
              {/* Why Choose Us */}
              <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-gray-800 p-8">
                <h3 className="text-2xl font-serif text-yellow-500 mb-6">Why Choose Ambiance Studio?</h3>
                <ul className="space-y-4">
                  {[
                    'Award-winning photography & videography team',
                    '15+ years of professional experience',
                    'State-of-the-art equipment & studio',
                    'Flexible, customizable packages',
                    'Fast turnaround times',
                    'Excellent customer service & support'
                  ].map((reason, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-black text-xs font-bold">{index + 1}</span>
                      </div>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Social Media & Newsletter */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-[#2a0f0f] to-black border-2 border-yellow-500/30 p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-yellow-500 mb-4">Stay Connected</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Follow us on social media for daily inspiration, behind-the-scenes content, and special offers.
              </p>
              
              <div className="flex justify-center gap-4 mb-8">
                {['Facebook', 'Instagram', 'YouTube', 'Twitter'].map((social) => (
                  <button
                    key={social}
                    className="w-12 h-12 rounded-full bg-gray-900 border-2 border-gray-800 hover:border-yellow-500 hover:bg-gray-800 transition-all flex items-center justify-center text-gray-400 hover:text-yellow-500"
                  >
                    <span className="text-xs font-bold">{social[0]}</span>
                  </button>
                ))}
              </div>
              
              <div className="max-w-md mx-auto">
                <h3 className="text-white font-semibold mb-3">Subscribe to Our Newsletter</h3>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 bg-black border-gray-700 text-white placeholder:text-gray-600"
                  />
                  <Button className="h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold px-8">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>
    </div>
  );
}
