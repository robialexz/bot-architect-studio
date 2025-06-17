import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PipelineBackground from './PipelineBackground';

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

const VideoShowcaseSectionNoMotion: React.FC = () => {
  // Simple video showcase - 2 actual videos
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

  return (
    <section className="relative py-12 bg-gradient-to-b from-background to-background/95 overflow-hidden">
      {/* Pipeline Background */}
      <PipelineBackground className="opacity-30" />

      {/* Content with glass morphism overlay */}
      <div className="relative z-10 bg-background/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-8 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Video Showcase
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
              See FlowsyAI in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch our latest demos and brand content
            </p>
          </div>

          {/* Simple Video Grid - Made smaller and wider */}
          <div className="mb-8 animate-slide-up">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-0">
                      {/* Simple Video - Made wider with 21:9 aspect ratio */}
                      <div className="aspect-[21/9] h-40 overflow-hidden rounded-t-lg">
                        <video
                          className="w-full h-full object-cover"
                          poster={video.thumbnail}
                          muted
                          loop
                          playsInline
                          autoPlay
                        >
                          <source src={video.videoUrl} type="video/mp4" />
                        </video>
                      </div>

                      {/* Video Info Below - Clean and Simple, more compact */}
                      <div className="p-4">
                        <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 text-xs">
                          {video.category}
                        </Badge>
                        <h4 className="text-foreground font-bold text-base mb-1">{video.title}</h4>
                        <p className="text-muted-foreground text-xs mb-2 leading-relaxed">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs font-medium">
                            {video.duration}
                          </span>
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            HD Quality
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default VideoShowcaseSectionNoMotion;
