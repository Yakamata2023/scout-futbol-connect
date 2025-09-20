import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Upload, 
  Video, 
  Image, 
  Edit3, 
  Save, 
  Plus, 
  X,
  MapPin,
  Trophy,
  Target,
  Calendar,
  Ruler,
  Weight
} from 'lucide-react';

interface PlayerData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  position?: string;
  preferred_foot?: string;
  height_cm?: number;
  weight_kg?: number;
  has_agent: boolean;
  agent_name?: string;
  agent_contact?: string;
  plays_professional: boolean;
  current_club?: string;
  league_name?: string;
  played_pro_before: boolean;
  itc_number?: string;
  profile_picture_url?: string;
  bio?: string;
  achievements?: string;
  wyn_management_agreement: boolean;
}

interface MediaItem {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  title?: string;
  description?: string;
  display_order: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  
  const [editForm, setEditForm] = useState<Partial<PlayerData>>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchPlayerData();
      fetchMediaItems();
    }
  }, [user, loading, navigate]);

  const fetchPlayerData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load player data",
      });
    } else if (data) {
      setPlayerData(data);
      setEditForm(data);
    }
  };

  const fetchMediaItems = async () => {
    if (!user) return;

    const { data: playerData } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (playerData) {
      const { data: media } = await supabase
        .from('player_media')
        .select('*')
        .eq('player_id', playerData.id)
        .order('display_order');

      setMediaItems((media || []) as MediaItem[]);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editForm) return;
    
    setSaving(true);
    
    try {
      if (playerData) {
        // Update existing player
        const { error } = await supabase
          .from('players')
          .update(editForm)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new player profile
        const { error } = await supabase
          .from('players')
          .insert({
            ...editForm,
            user_id: user.id,
            email: user.email || '',
            first_name: editForm.first_name || '',
            last_name: editForm.last_name || '',
          });

        if (error) throw error;
      }

      await fetchPlayerData();
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (files: FileList | null, mediaType: 'image' | 'video') => {
    if (!files || !playerData) return;

    const file = files[0];
    if (!file) return;

    // Check if we already have 10 media items
    if (mediaItems.length >= 10) {
      toast({
        variant: "destructive",
        title: "Upload Limit Reached",
        description: "You can upload a maximum of 10 media items.",
      });
      return;
    }

    const fileId = Date.now().toString();
    setUploadingFiles(prev => new Set([...prev, fileId]));

    try {
      // Upload to Supabase Storage
      const fileName = `${playerData.id}/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('scoutfutbolbucket')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('scoutfutbolbucket')
        .getPublicUrl(fileName);

      // Save to database
      const nextOrder = Math.max(0, ...mediaItems.map(item => item.display_order)) + 1;
      
      const { error: dbError } = await supabase
        .from('player_media')
        .insert({
          player_id: playerData.id,
          media_url: urlData.publicUrl,
          media_type: mediaType,
          display_order: nextOrder,
          title: file.name,
        });

      if (dbError) throw dbError;

      await fetchMediaItems();
      
      toast({
        title: "Success",
        description: `${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
      });
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const deleteMediaItem = async (mediaId: string) => {
    const { error } = await supabase
      .from('player_media')
      .delete()
      .eq('id', mediaId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete media item",
      });
    } else {
      await fetchMediaItems();
      toast({
        title: "Success",
        description: "Media item deleted successfully",
      });
    }
  };

  const getProfileCompleteness = () => {
    if (!playerData) return 0;
    
    const fields = [
      'first_name', 'last_name', 'phone', 'date_of_birth', 
      'position', 'preferred_foot', 'height_cm', 'weight_kg', 'bio'
    ];
    
    const filledFields = fields.filter(field => playerData[field as keyof PlayerData]);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Player Dashboard</h1>
            <p className="text-muted-foreground">Manage your football profile and media</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Profile Completeness</div>
              <div className="flex items-center space-x-2">
                <Progress value={getProfileCompleteness()} className="w-24" />
                <span className="text-sm font-medium">{getProfileCompleteness()}%</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="media">Media ({mediaItems.length}/10)</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(playerData || {});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {playerData ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>First Name</Label>
                          {isEditing ? (
                            <Input
                              value={editForm.first_name || ''}
                              onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                            />
                          ) : (
                            <p className="text-sm mt-1">{playerData.first_name}</p>
                          )}
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          {isEditing ? (
                            <Input
                              value={editForm.last_name || ''}
                              onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                            />
                          ) : (
                            <p className="text-sm mt-1">{playerData.last_name}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm mt-1 text-muted-foreground">{playerData.email}</p>
                      </div>
                      
                      <div>
                        <Label>Phone</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm mt-1">{playerData.phone || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label>Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editForm.date_of_birth || ''}
                            onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm mt-1">{playerData.date_of_birth ? new Date(playerData.date_of_birth).toLocaleDateString() : 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Football Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        Football Information
                      </h3>
                      
                      <div>
                        <Label>Position</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.position || ''}
                            onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                          />
                        ) : (
                          <Badge variant="outline" className="mt-1">
                            {playerData.position || 'Not specified'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Height (cm)</Label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editForm.height_cm || ''}
                              onChange={(e) => setEditForm({...editForm, height_cm: parseInt(e.target.value) || undefined})}
                            />
                          ) : (
                            <p className="text-sm mt-1 flex items-center">
                              <Ruler className="h-3 w-3 mr-1" />
                              {playerData.height_cm ? `${playerData.height_cm} cm` : 'Not provided'}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Weight (kg)</Label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editForm.weight_kg || ''}
                              onChange={(e) => setEditForm({...editForm, weight_kg: parseInt(e.target.value) || undefined})}
                            />
                          ) : (
                            <p className="text-sm mt-1 flex items-center">
                              <Weight className="h-3 w-3 mr-1" />
                              {playerData.weight_kg ? `${playerData.weight_kg} kg` : 'Not provided'}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Preferred Foot</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.preferred_foot || ''}
                            onChange={(e) => setEditForm({...editForm, preferred_foot: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm mt-1">{playerData.preferred_foot || 'Not specified'}</p>
                        )}
                      </div>
                      
                      {/* Professional Status */}
                      <div className="space-y-2">
                        <Label>Professional Status</Label>
                        <div className="flex flex-wrap gap-2">
                          {playerData.has_agent && (
                            <Badge variant="secondary">Has Agent</Badge>
                          )}
                          {playerData.plays_professional && (
                            <Badge variant="secondary">Professional Player</Badge>
                          )}
                          {playerData.played_pro_before && (
                            <Badge variant="secondary">Pro Experience</Badge>
                          )}
                          {playerData.wyn_management_agreement && (
                            <Badge className="bg-primary">WYN Managed</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Complete your player profile to get discovered by scouts</p>
                    <Button onClick={() => setIsEditing(true)}>
                      Create Profile
                    </Button>
                  </div>
                )}
                
                {/* Bio and Achievements */}
                {playerData && (
                  <div className="space-y-4 pt-6 border-t">
                    <div>
                      <Label>Bio</Label>
                      {isEditing ? (
                        <Textarea
                          value={editForm.bio || ''}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          placeholder="Tell scouts about your football journey..."
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm mt-1">{playerData.bio || 'No bio provided'}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Achievements</Label>
                      {isEditing ? (
                        <Textarea
                          value={editForm.achievements || ''}
                          onChange={(e) => setEditForm({...editForm, achievements: e.target.value})}
                          placeholder="List your football achievements and awards..."
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm mt-1">{playerData.achievements || 'No achievements listed'}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Media Gallery</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload videos and images to showcase your skills. Maximum 10 items allowed.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Upload Section */}
                {mediaItems.length < 10 && playerData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">Upload Video</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e.target.files, 'video')}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('video-upload')?.click()}
                        disabled={uploadingFiles.size > 0}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Choose Video
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">Upload Image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files, 'image')}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploadingFiles.size > 0}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Choose Image
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Media Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaItems.map((item) => (
                    <Card key={item.id} className="relative group">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        {item.media_type === 'video' ? (
                          <video
                            src={item.media_url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteMediaItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline">
                            {item.media_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            #{item.display_order}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {mediaItems.length === 0 && (
                  <div className="text-center py-12">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No media uploaded yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload videos and images to showcase your football skills to scouts
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discovery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Scout Discovery</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to scouts and club representatives
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Scout Discovery Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your profile and upload media to increase your chances of being discovered
                  </p>
                  
                  <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getProfileCompleteness() > 70 ? 'bg-green-500' : 'bg-muted'}`} />
                      <span>Profile Complete</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${mediaItems.length > 0 ? 'bg-green-500' : 'bg-muted'}`} />
                      <span>Media Uploaded</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;