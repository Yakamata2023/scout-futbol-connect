import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ExternalLink } from 'lucide-react';

interface MediaItem {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  title?: string;
  description?: string;
}

interface MediaViewerProps {
  media: MediaItem | null;
  open: boolean;
  onClose: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ media, open, onClose }) => {
  if (!media) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.media_url;
    link.download = media.title || 'media-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExternalView = () => {
    window.open(media.media_url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{media.title || 'Media Preview'}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExternalView}
              className="flex items-center space-x-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {media.media_type === 'image' ? (
            <img
              src={media.media_url}
              alt={media.title || 'Media content'}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          ) : (
            <video
              src={media.media_url}
              controls
              className="w-full h-auto max-h-[70vh] rounded-lg"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {media.description && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{media.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};