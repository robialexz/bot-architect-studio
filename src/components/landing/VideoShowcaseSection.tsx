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

  // Demo video data - replace with real videos
  const videos: VideoItem[] = [
    {
      id: 'hero-animation',
      title: 'FlowsyAI Brand Animation',
      description: 'Our signature animated logo showcasing the future of AI automation',
      thumbnail: '/flowsy-logo.svg',
      videoUrl: '/background-animation.mp4',
      duration: '0:15',
      category: 'Branding',
      featured: true,
    },
    {
      id: 'workflow-demo',
      title: 'AR Workflow Building Demo',
      description: 'Experience building AI workflows in 3D space using mobile AR',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4', // Placeholder
      duration: '2:30',
      category: 'Product Demo',
      featured: true,
    },
    {
      id: 'platform-overview',
      title: 'Platform Overview',
      description: 'Complete walkthrough of FlowsyAI features and capabilities',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4', // Placeholder
      duration: '3:45',
      category: 'Tutorial',
    },
    {
      id: 'ai-integration',
      title: 'AI Model Integration',
      description: 'How to connect and configure multiple AI services seamlessly',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4', // Placeholder
      duration: '4:20',
      category: 'Technical',
    },
  ];

  const togglePlay = (videoId: string) => {
    setIsPlaying(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const toggleMute = (videoId: string) => {
    setIsMuted(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const featuredVideos = videos.filter(video => video.featured);
  const regularVideos = videos.filter(video => !video.featured);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Video Showcase
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
            See FlowsyAI in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the power of AI automation through our comprehensive video library
          </p>
        </motion.div>

        {/* Featured Videos */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Featured Videos</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredVideos.map((video, index) => (
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

        {/* Regular Videos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">More Videos</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group overflow-hidden border-muted hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <video
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        poster={video.thumbnail}
                        muted
                        loop
                        playsInline
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                      </video>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 text-black hover:bg-white"
                          onClick={() => setSelectedVideo(video.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch
                        </Button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <Badge className="mb-1 bg-muted/20 text-white border-white/20 text-xs">
                          {video.category}
                        </Badge>
                        <h4 className="text-white font-medium text-sm mb-1">{video.title}</h4>
                        <span className="text-white/60 text-xs">{video.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary via-sapphire to-primary text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            View All Videos
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
