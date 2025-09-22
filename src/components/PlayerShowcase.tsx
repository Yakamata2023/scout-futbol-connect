import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  age: number;
  country: string;
  profileImage: string;
  videoThumbnail: string;
  currentClub?: string;
  achievements: string[];
}

const mockPlayers: PlayerProfile[] = [
  {
    id: '1',
    firstName: 'Marcus',
    lastName: 'Johnson',
    position: 'Forward',
    age: 22,
    country: 'Nigeria',
    profileImage: 'https://images.unsplash.com/photo-1594736797933-d0a9ba4d0964?w=400&h=400&fit=crop&crop=face',
    videoThumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    currentClub: 'Local FC',
    achievements: ['Top Scorer 2023', 'MVP Regional League']
  },
  {
    id: '2',
    firstName: 'Emmanuel',
    lastName: 'Adebayo',
    position: 'Midfielder',
    age: 20,
    country: 'Nigeria',
    profileImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop&crop=face',
    videoThumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    currentClub: 'Youth Academy',
    achievements: ['Best Midfielder 2023', 'National U21 Team']
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Okafor',
    position: 'Defender',
    age: 24,
    country: 'Nigeria',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    videoThumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    achievements: ['Best Defender 2023', 'Clean Sheet Record']
  },
  {
    id: '4',
    firstName: 'Samuel',
    lastName: 'Okoro',
    position: 'Goalkeeper',
    age: 21,
    country: 'Nigeria',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    videoThumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    currentClub: 'State Team',
    achievements: ['Golden Glove 2023', 'Penalty Save Expert']
  },
  {
    id: '5',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    position: 'Winger',
    age: 19,
    country: 'Nigeria',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    videoThumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    achievements: ['Fastest Player 2023', 'Most Assists']
  }
];

export const PlayerShowcase: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Players
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet some of our talented footballers actively seeking professional opportunities
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                <div className="relative">
                  {/* Profile Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={player.profileImage}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Position Badge */}
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {player.position}
                    </Badge>
                    
                    {/* Video Preview Indicator */}
                    <div className="absolute bottom-3 right-3 bg-black/70 rounded-full p-2">
                      <Play className="h-4 w-4 text-white" fill="white" />
                    </div>
                  </div>
                  
                  {/* Video Thumbnail Preview */}
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={player.videoThumbnail}
                      alt="Player highlights"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-black/70 rounded-full p-3">
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold">
                        {player.firstName} {player.lastName}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {player.country}
                        <Calendar className="h-4 w-4 ml-3 mr-1" />
                        {player.age} years old
                      </div>
                    </div>
                    
                    {player.currentClub && (
                      <div className="text-sm">
                        <span className="font-medium">Current Club:</span> {player.currentClub}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Key Achievements:</span>
                      <div className="flex flex-wrap gap-1">
                        {player.achievements.map((achievement, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to showcase your talent like these players?
          </p>
          <Badge variant="outline" className="px-4 py-2">
            Join 500+ Players Already on Our Platform
          </Badge>
        </div>
      </div>
    </section>
  );
};