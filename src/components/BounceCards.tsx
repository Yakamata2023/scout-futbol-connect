import React from 'react';
import { motion } from 'framer-motion';
import { Play, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  title?: string;
}

interface BounceCardsProps {
  media: MediaItem[];
  onMediaClick?: (item: MediaItem) => void;
}

export const BounceCards: React.FC<BounceCardsProps> = ({ media, onMediaClick }) => {
  if (media.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No media uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {media.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.05, 
            rotate: Math.random() * 6 - 3,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          className="relative aspect-square cursor-pointer group"
          onClick={() => onMediaClick?.(item)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300" />
          
          {item.media_type === 'image' ? (
            <img
              src={item.media_url}
              alt={item.title || 'Player media'}
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center">
              <video
                src={item.media_url}
                className="w-full h-full object-cover rounded-xl"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3">
                  <Play className="w-6 h-6 text-white" fill="white" />
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-2 right-2">
            <div className="bg-black/50 rounded-full p-1">
              {item.media_type === 'image' ? (
                <ImageIcon className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          {item.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-xl">
              <p className="text-white text-sm font-medium truncate">{item.title}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};