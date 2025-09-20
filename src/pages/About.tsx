import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Target, 
  Handshake, 
  Star, 
  Award, 
  Globe,
  Shield,
  TrendingUp,
  Heart
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">About ScoutFutbol</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are the bridge between talented footballers and professional opportunities worldwide, 
            powered by WYN Management's expertise in football representation and development.
          </p>
        </section>

        {/* Our Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Target className="h-8 w-8 text-primary mr-3" />
              Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              ScoutFutbol exists to democratize football scouting and create pathways for talented 
              players to reach professional levels. We believe that talent should be discovered 
              regardless of geographic location or economic background.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through our innovative platform, we connect aspiring footballers with professional 
              scouts and club representatives, while providing comprehensive management services 
              to guide players through their professional journey.
            </p>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary-glow/10">
            <CardContent className="space-y-6 p-0">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">Connecting talent across continents</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Professional Standards</h3>
                  <p className="text-sm text-muted-foreground">Maintaining industry best practices</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Player-Centered</h3>
                  <p className="text-sm text-muted-foreground">Putting players' interests first</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* WYN Management Services */}
        <section className="bg-muted/30 rounded-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Handshake className="h-8 w-8 text-primary mr-3" />
              WYN Management Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond scouting, we offer comprehensive management services for professional footballers, 
              ensuring they have the support needed to succeed at the highest level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Publicity & Branding</h3>
                <p className="text-sm text-muted-foreground">
                  Building your personal brand and public image in the football world
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Handshake className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Deal Negotiations</h3>
                <p className="text-sm text-muted-foreground">
                  Expert contract negotiations ensuring fair terms and optimal career moves
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Industry Lobbying</h3>
                <p className="text-sm text-muted-foreground">
                  Leveraging our network to create opportunities and open doors
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Star className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Career Management</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive career planning and professional development guidance
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5-Year Management Agreement */}
        <section className="text-center bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-xl p-8 md:p-12">
          <Award className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">5-Year Management Partnership</h2>
          <p className="text-xl mb-6 opacity-90 max-w-3xl mx-auto">
            All players who sign with us receive comprehensive management services for the first 5 years 
            of their professional career, with the option for renewal if both parties agree.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Years 1-2: Foundation</h3>
              <p className="text-sm opacity-90">
                Focus on adaptation, skill development, and establishing your professional presence
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Years 3-4: Growth</h3>
              <p className="text-sm opacity-90">
                Career advancement, strategic moves, and brand building initiatives
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Year 5+: Excellence</h3>
              <p className="text-sm opacity-90">
                Elite-level representation and long-term career sustainability planning
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-muted-foreground">
                We operate with complete transparency and honesty in all our dealings, 
                ensuring fair representation for both players and clubs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for the highest standards in everything we do, from platform 
                technology to player representation and career guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Passion</h3>
              <p className="text-muted-foreground">
                Our love for football drives us to create opportunities and help players 
                achieve their dreams at the professional level.
              </p>
            </div>
          </div>
        </section>

        {/* Success Stories Preview */}
        <section className="bg-muted/30 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            We've helped numerous talented players transition from amateur to professional football, 
            securing contracts with clubs across different leagues and continents.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Players Represented</div>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Successful Signings</div>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Partner Clubs</div>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Join the growing community of players who have achieved their professional football dreams through ScoutFutbol.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join ScoutFutbol today and take the first step toward your professional football career.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth?mode=signup')}
              className="px-8"
            >
              Register as Player
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/contact')}
              className="px-8"
            >
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;