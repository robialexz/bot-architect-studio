import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  featured?: boolean;
}

const VideoShowcaseSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});

  // Real video showcase - 2 actual videos
  const videos: VideoItem[] = [
    {
      id: 'videoclip-1',
      title: 'FlowsyAI Platform Demo',
      description: 'Discover the power and capabilities of our AI automation platform',
      thumbnail: '/flowsy-logo.svg',
      videoUrl: '/videoclip-1.mp4',
      duration: '1:30',
      category: 'Platform Demo',
      featured: true,
    },
    {
      id: 'videoclip-2',
      title: 'AI Workflow Showcase',
      description: 'See how FlowsyAI transforms complex workflows into simple automation',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/videoclip-2.mp4',
      duration: '2:15',
      category: 'Workflow Demo',
      featured: true,
    },
  ];

  const togglePlay = (videoId: string) => {
    setIsPlaying(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const toggleMute = (videoId: string) => {
    setIsMuted(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Video Showcase
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
            See FlowsyAI in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our latest demos and brand content
          </p>
        </motion.div>

        {/* Simple Video Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <video
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        poster={video.thumbnail}
                        muted={isMuted[video.id] !== false}
                        loop
                        playsInline
                        autoPlay
                        controls
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                      </video>

                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 text-black hover:bg-white"
                            onClick={() => togglePlay(video.id)}
                          >
                            {isPlaying[video.id] ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 text-black hover:bg-white"
                            onClick={() => toggleMute(video.id)}
                          >
                            {isMuted[video.id] ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 text-black hover:bg-white"
                            onClick={() => setSelectedVideo(video.id)}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Video Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">
                          {video.category}
                        </Badge>
                        <h4 className="text-white font-semibold mb-1">{video.title}</h4>
                        <p className="text-white/80 text-sm mb-2">{video.description}</p>
                        <span className="text-white/60 text-xs">{video.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
