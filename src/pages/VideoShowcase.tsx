import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Share2,
  Heart,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  views: number;
  likes: number;
  featured?: boolean;
  uploadDate: string;
}

const VideoShowcase: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Extended video library
  const videos: VideoItem[] = [
    {
      id: 'hero-animation',
      title: 'FlowsyAI Brand Animation',
      description:
        'Our signature animated logo showcasing the future of AI automation with stunning visual effects',
      thumbnail: '/flowsy-logo.svg',
      videoUrl: '/background-animation.mp4',
      duration: '0:15',
      category: 'Branding',
      views: 15420,
      likes: 892,
      featured: true,
      uploadDate: '2025-06-01',
    },
    {
      id: 'workflow-demo',
      title: 'AR Workflow Building Demo',
      description: 'Experience building AI workflows in 3D space using mobile AR technology',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4',
      duration: '2:30',
      category: 'Product Demo',
      views: 8750,
      likes: 654,
      featured: true,
      uploadDate: '2025-05-28',
    },
    {
      id: 'platform-overview',
      title: 'Platform Overview',
      description: 'Complete walkthrough of FlowsyAI features and capabilities',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4',
      duration: '3:45',
      category: 'Tutorial',
      views: 12300,
      likes: 789,
      uploadDate: '2025-05-25',
    },
    {
      id: 'ai-integration',
      title: 'AI Model Integration',
      description: 'How to connect and configure multiple AI services seamlessly',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4',
      duration: '4:20',
      category: 'Technical',
      views: 6890,
      likes: 445,
      uploadDate: '2025-05-22',
    },
    {
      id: 'mobile-ar-demo',
      title: 'Mobile AR Interface Demo',
      description: 'Revolutionary mobile AR interface for workflow building',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4',
      duration: '1:45',
      category: 'Product Demo',
      views: 9650,
      likes: 723,
      uploadDate: '2025-05-20',
    },
    {
      id: 'token-economics',
      title: 'Token Economics Explained',
      description: 'Understanding FlowsyAI tokenomics and tier system',
      thumbnail: '/hero-visual-coming-soon.svg',
      videoUrl: '/background-animation.mp4',
      duration: '5:15',
      category: 'Educational',
      views: 4320,
      likes: 298,
      uploadDate: '2025-05-18',
    },
  ];

  const categories = ['all', 'Branding', 'Product Demo', 'Tutorial', 'Technical', 'Educational'];

  const filteredVideos =
    activeCategory === 'all' ? videos : videos.filter(video => video.category === activeCategory);

  const featuredVideos = videos.filter(video => video.featured);

  const togglePlay = (videoId: string) => {
    setIsPlaying(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const toggleMute = (videoId: string) => {
    setIsMuted(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
              Video Showcase
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
              FlowsyAI Video Library
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore our comprehensive collection of demos, tutorials, and brand content showcasing
              the future of AI automation
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {formatViews(videos.reduce((sum, video) => sum + video.views, 0))} total views
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {videos.reduce((sum, video) => sum + video.likes, 0)} likes
              </span>
              <span>{videos.length} videos</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            {/* Category Tabs */}
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full max-w-4xl">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category === 'all' ? 'All Videos' : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            {/* Featured Videos Section */}
            {activeCategory === 'all' && (
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-8 text-center">Featured Videos</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {featuredVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
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

                            {/* Video Stats */}
                            <div className="absolute top-4 right-4 flex gap-2">
                              <Badge className="bg-black/50 text-white border-white/20">
                                {video.duration}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                {video.category}
                              </Badge>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {formatViews(video.views)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {video.likes}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                            <p className="text-muted-foreground mb-4">{video.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {new Date(video.uploadDate).toLocaleDateString()}
                              </span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Videos Grid */}
            <TabsContent value={activeCategory} className="mt-0">
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
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

                          <div className="absolute top-3 right-3">
                            <Badge className="bg-black/50 text-white border-white/20 text-xs">
                              {video.duration}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-muted/20 text-foreground border-muted text-xs">
                              {video.category}
                            </Badge>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatViews(video.views)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {video.likes}
                              </span>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-1 text-sm">{video.title}</h3>
                          <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                            {video.description}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(video.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default VideoShowcase;
