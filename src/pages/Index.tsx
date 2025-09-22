import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { PlayerShowcase } from '@/components/PlayerShowcase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Video, Target, Star, Shield, Globe, Award } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 to-primary-glow/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ScoutFutbol
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect talented footballers with professional scouts worldwide. 
            Upload your skills, get discovered, and take your career to the next level.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth?mode=signup')}
                className="text-lg px-8 py-6"
              >
                Join as Player
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </div>
          ) : (
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8 py-6"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose ScoutFutbol?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Video className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Upload Your Skills</h3>
                <p className="text-muted-foreground">
                  Share up to 10 videos and images showcasing your football abilities. 
                  Let your talent speak for itself.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Scout Network</h3>
                <p className="text-muted-foreground">
                  Connect with professional scouts and club representatives from leagues 
                  worldwide looking for new talent.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Professional Representation</h3>
                <p className="text-muted-foreground">
                  WYN Management handles negotiations between you and clubs, 
                  ensuring fair deals and professional guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Register Profile</h3>
              <p className="text-sm text-muted-foreground">
                Create your detailed player profile with personal and football information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Upload Media</h3>
              <p className="text-sm text-muted-foreground">
                Share videos and photos of your best plays and training sessions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Discovered</h3>
              <p className="text-sm text-muted-foreground">
                Scouts search and discover your profile based on position and skills.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Professional Deal</h3>
              <p className="text-sm text-muted-foreground">
                WYN negotiates contracts and handles the transition to professional football.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Player Showcase */}
      <PlayerShowcase />

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Join Thousands of Aspiring Players
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Registered Players</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Professional Scouts</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Successful Signings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Professional Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join ScoutFutbol today and get 5 years of professional management services with WYN.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth?mode=signup')}
              className="text-lg px-8 py-6"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Register Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/contact')}
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="font-bold">ScoutFutbol</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting football talent with professional opportunities worldwide.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <div className="space-y-2 text-sm">
              <div><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/auth')}>Sign In</Button></div>
              <div><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/auth?mode=signup')}>Register</Button></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <div className="space-y-2 text-sm">
              <div><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/about')}>About Us</Button></div>
              <div><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/contact')}>Contact</Button></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Player Management</div>
              <div>Contract Negotiation</div>
              <div>Professional Guidance</div>
              <div>Career Development</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ScoutFutbol by WYN Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
