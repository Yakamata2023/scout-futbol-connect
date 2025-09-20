import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Mail, Lock, User, Calendar, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface State {
  id: string;
  name: string;
  country_id: string;
}

interface LGA {
  id: string;
  name: string;
  state_id: string;
}

const Auth = () => {
  const { user, signUp, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  
  const [activeTab, setActiveTab] = useState(defaultMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  
  // Form data for both sign in and registration
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    position: '',
    preferredFoot: '',
    heightCm: '',
    weightKg: '',
    hasAgent: false,
    agentName: '',
    agentContact: '',
    playsProfessional: false,
    currentClub: '',
    leagueName: '',
    playedProBefore: false,
    itcNumber: '',
    countryId: '',
    stateId: '',
    lgaId: '',
    bio: '',
    achievements: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      fetchStates(formData.countryId);
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.stateId) {
      fetchLGAs(formData.stateId);
    }
  }, [formData.stateId]);

  const fetchCountries = async () => {
    const { data } = await supabase.from('countries').select('*').order('name');
    setCountries(data || []);
  };

  const fetchStates = async (countryId: string) => {
    const { data } = await supabase
      .from('states')
      .select('*')
      .eq('country_id', countryId)
      .order('name');
    setStates(data || []);
    setFormData(prev => ({ ...prev, stateId: '', lgaId: '' }));
  };

  const fetchLGAs = async (stateId: string) => {
    const { data } = await supabase
      .from('lgas')
      .select('*')
      .eq('state_id', stateId)
      .order('name');
    setLgas(data || []);
    setFormData(prev => ({ ...prev, lgaId: '' }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      date_of_birth: formData.dateOfBirth,
      position: formData.position,
      preferred_foot: formData.preferredFoot,
      height_cm: formData.heightCm ? parseInt(formData.heightCm) : null,
      weight_kg: formData.weightKg ? parseInt(formData.weightKg) : null,
      has_agent: formData.hasAgent,
      agent_name: formData.agentName,
      agent_contact: formData.agentContact,
      plays_professional: formData.playsProfessional,
      current_club: formData.currentClub,
      league_name: formData.leagueName,
      played_pro_before: formData.playedProBefore,
      itc_number: formData.itcNumber,
      country_id: formData.countryId,
      state_id: formData.stateId,
      lga_id: formData.lgaId,
      bio: formData.bio,
      achievements: formData.achievements,
    };

    const { error } = await signUp(formData.email, formData.password, userData);
    
    if (!error) {
      setActiveTab('signin');
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary-glow/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to ScoutFutbol</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Register Player</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Football Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Football Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                          <SelectItem value="defender">Defender</SelectItem>
                          <SelectItem value="midfielder">Midfielder</SelectItem>
                          <SelectItem value="forward">Forward</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Foot</Label>
                      <Select value={formData.preferredFoot} onValueChange={(value) => handleInputChange('preferredFoot', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select foot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Left">Left</SelectItem>
                          <SelectItem value="Right">Right</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Height (cm)</Label>
                      <Input
                        type="number"
                        value={formData.heightCm}
                        onChange={(e) => handleInputChange('heightCm', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        value={formData.weightKg}
                        onChange={(e) => handleInputChange('weightKg', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Status */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Professional Status</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasAgent"
                      checked={formData.hasAgent}
                      onCheckedChange={(checked) => handleInputChange('hasAgent', checked)}
                    />
                    <Label htmlFor="hasAgent">I have an agent/representative</Label>
                  </div>
                  
                  {formData.hasAgent && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div className="space-y-2">
                        <Label>Agent Name</Label>
                        <Input
                          value={formData.agentName}
                          onChange={(e) => handleInputChange('agentName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Agent Contact</Label>
                        <Input
                          value={formData.agentContact}
                          onChange={(e) => handleInputChange('agentContact', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="playsProfessional"
                      checked={formData.playsProfessional}
                      onCheckedChange={(checked) => handleInputChange('playsProfessional', checked)}
                    />
                    <Label htmlFor="playsProfessional">Currently playing for a professional club</Label>
                  </div>
                  
                  {formData.playsProfessional && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div className="space-y-2">
                        <Label>Current Club</Label>
                        <Input
                          value={formData.currentClub}
                          onChange={(e) => handleInputChange('currentClub', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>League</Label>
                        <Input
                          value={formData.leagueName}
                          onChange={(e) => handleInputChange('leagueName', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="playedProBefore"
                      checked={formData.playedProBefore}
                      onCheckedChange={(checked) => handleInputChange('playedProBefore', checked)}
                    />
                    <Label htmlFor="playedProBefore">Previously played professional football</Label>
                  </div>
                  
                  {formData.playedProBefore && (
                    <div className="ml-6 space-y-2">
                      <Label>ITC Number (International Transfer Certificate)</Label>
                      <Input
                        value={formData.itcNumber}
                        onChange={(e) => handleInputChange('itcNumber', e.target.value)}
                        placeholder="Required for verification"
                      />
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Location</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select value={formData.countryId} onValueChange={(value) => handleInputChange('countryId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Select value={formData.stateId} onValueChange={(value) => handleInputChange('stateId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>LGA</Label>
                      <Select value={formData.lgaId} onValueChange={(value) => handleInputChange('lgaId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select LGA" />
                        </SelectTrigger>
                        <SelectContent>
                          {lgas.map((lga) => (
                            <SelectItem key={lga.id} value={lga.id}>
                              {lga.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Bio and Achievements */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself and your football journey..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Achievements</Label>
                    <Textarea
                      value={formData.achievements}
                      onChange={(e) => handleInputChange('achievements', e.target.value)}
                      placeholder="List your football achievements, awards, and notable performances..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Register as Player'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;