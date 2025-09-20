import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send,
  Trophy,
  Clock,
  Globe,
  Users
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Contact ScoutFutbol</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with our team for any questions about the platform, player representation, 
            or partnership opportunities.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Get in Touch</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a 
                      href="mailto:wynmanagement.ng@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      wynmanagement.ng@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <a 
                      href="https://wa.me/2347051450146"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +234-705-145-0146
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Headquarters</h3>
                    <p className="text-muted-foreground">
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Response Time</h3>
                    <p className="text-muted-foreground">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Contact Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.open('mailto:wynmanagement.ng@gmail.com', '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                
                <Button 
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white" 
                  onClick={() => window.open('https://wa.me/2347051450146', '_blank')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about ScoutFutbol and our services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Trophy className="h-4 w-4 text-primary mr-2" />
                  How do I get started on ScoutFutbol?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Simply register as a player, complete your profile with detailed information, 
                  and upload videos and images showcasing your football skills. Our scouts will 
                  discover and review profiles regularly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="h-4 w-4 text-primary mr-2" />
                  What is included in WYN Management services?
                </h3>
                <p className="text-muted-foreground text-sm">
                  We provide comprehensive management including publicity, contract negotiations, 
                  career lobbying, and professional development guidance for 5 years, with renewal options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Globe className="h-4 w-4 text-primary mr-2" />
                  Do you work with international clubs?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we have partnerships with clubs and scouts from various leagues worldwide, 
                  including Africa, Europe, Asia, and the Americas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <MessageSquare className="h-4 w-4 text-primary mr-2" />
                  How much does it cost to join?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Registration is free for players. We only earn when you do - through successful 
                  contract negotiations and our comprehensive management services.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Office Hours */}
        <section className="bg-muted/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Availability</h2>
          <p className="text-muted-foreground mb-6">
            We're here to help you with your football career aspirations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold">Email Responses</h3>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </div>
            <div>
              <h3 className="font-semibold">WhatsApp Support</h3>
              <p className="text-sm text-muted-foreground">9 AM - 6 PM WAT</p>
            </div>
            <div>
              <h3 className="font-semibold">Time Zone</h3>
              <p className="text-sm text-muted-foreground">West Africa Time (UTC+1)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;