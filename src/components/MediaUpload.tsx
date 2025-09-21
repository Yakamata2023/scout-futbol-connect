import React, { useCallback, useState } from 'react';
import { Upload, X, Play, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MediaUploadProps {
  playerId: string;
  onUploadComplete?: () => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ playerId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isSizeValid = file.size <= 50 * 1024 * 1024; // 50MB limit

      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image or video file`,
          variant: "destructive"
        });
        return false;
      }

      if (!isSizeValid) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB limit`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  }, [toast]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${playerId}/${Date.now()}-${i}.${fileExt}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('scoutfutbolbucket')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('scoutfutbolbucket')
          .getPublicUrl(fileName);

        // Save media record to database
        const { error: dbError } = await supabase
          .from('player_media')
          .insert({
            player_id: playerId,
            media_type: file.type.startsWith('image/') ? 'image' : 'video',
            media_url: data.publicUrl,
            title: title || file.name,
            description: description,
            display_order: i + 1
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully`
      });

      // Reset form
      setFiles([]);
      setTitle('');
      setDescription('');
      onUploadComplete?.();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title (optional)</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your media"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (optional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your media (skills shown, match highlights, etc.)"
            rows={3}
          />
        </div>

        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Click to upload files</p>
            <p className="text-sm text-muted-foreground">
              Support for images and videos up to 50MB
            </p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Selected Files:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="bg-muted rounded-lg p-4 flex items-center space-x-2">
                    {file.type.startsWith('image/') ? (
                      <Image className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={uploadFiles} 
          disabled={uploading || files.length === 0}
          className="w-full"
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
        </Button>
      </CardContent>
    </Card>
  );
};