import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Repeat2, ExternalLink, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import xService, { XPost, XService } from '@/services/twitterService';
import PipelineBackground from './PipelineBackground';

// X Logo Component (modern X branding)
const XLogo: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Skeleton Component
const XSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 sm:p-6 overflow-hidden"
        >
          {/* Header Skeleton */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
                <div className="w-4 h-4 bg-white/10 rounded-full animate-pulse" />
                <div className="w-4 h-4 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-3 bg-white/10 rounded animate-pulse w-32" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-4/5" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-3/5" />
          </div>

          {/* Media Skeleton (sometimes) */}
          {index % 2 === 0 && (
            <div className="mb-4">
              <div className="h-40 bg-white/10 rounded-xl animate-pulse" />
            </div>
          )}

          {/* Engagement Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 bg-white/10 rounded animate-pulse w-8" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-3 bg-white/10 rounded animate-pulse w-12" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

interface MediaComponentProps {
  media: XPost['media'];
  postId: string;
}

const MediaComponent: React.FC<MediaComponentProps> = ({ media, postId }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (!media || media.length === 0) return null;

  const currentMedia = media[currentMediaIndex];

  const handleVideoToggle = () => {
    const video = document.getElementById(`video-${postId}`) as HTMLVideoElement;
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleMuteToggle = () => {
    const video = document.getElementById(`video-${postId}`) as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative mt-3 rounded-xl overflow-hidden bg-black/20">
      {currentMedia.type === 'photo' && (
        <img
          src={currentMedia.url}
          alt={currentMedia.alt_text || 'Post image'}
          className="w-full h-auto max-h-80 object-cover"
          loading="lazy"
        />
      )}
      
      {(currentMedia.type === 'video' || currentMedia.type === 'animated_gif') && (
        <div className="relative">
          <video
            id={`video-${postId}`}
            src={currentMedia.url}
            poster={currentMedia.preview_image_url}
            className="w-full h-auto max-h-80 object-cover"
            loop={currentMedia.type === 'animated_gif'}
            muted={isMuted}
            playsInline
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          />
          
          {/* Video Controls */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <button
              onClick={handleVideoToggle}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
            >
              {isVideoPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
          </div>
          
          {/* Mute Toggle */}
          {currentMedia.type === 'video' && (
            <button
              onClick={handleMuteToggle}
              className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Media Navigation for multiple items */}
      {media.length > 1 && (
        <div className="absolute bottom-2 left-2 flex gap-1">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMediaIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentMediaIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PollComponentProps {
  polls: XPost['polls'];
}

const PollComponent: React.FC<PollComponentProps> = ({ polls }) => {
  if (!polls || polls.length === 0) return null;

  const poll = polls[0];
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10">
      <div className="space-y-2">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

          return (
            <div key={index} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white/90 text-sm">{option.label}</span>
                <span className="text-white/60 text-xs">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-white/60">
        {XService.formatEngagementNumber(totalVotes)} votes •
        {poll.voting_status === 'open' ? ' Voting open' : ' Final results'}
      </div>
    </div>
  );
};

interface XCardProps {
  post: XPost;
  index: number;
}

const XCard: React.FC<XCardProps> = ({ post, index }) => {
  const processedText = XService.processTextWithEntities(post.text, post.entities);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
        scale: 0.9,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      className="group"
    >
      <motion.div
        className="relative backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 sm:p-6 overflow-hidden group-hover:border-cyan-400/60 transition-all duration-500"
        whileHover={{
          scale: 1.02,
          y: -8,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0">
              <img
                src={post.author.profile_image_url}
                alt={post.author.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-400/30"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/flowsy-logo.svg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-sm sm:text-base truncate">
                  {post.author.name}
                </h3>
                {post.author.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <XLogo className="w-4 h-4 text-white/80" />
              </div>
              <p className="text-white/60 text-xs sm:text-sm">
                @{post.author.username} • {XService.formatRelativeTime(post.created_at)}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {processedText}
            </p>
          </div>

          {/* Rich Media */}
          <MediaComponent media={post.media} postId={post.id} />

          {/* Polls */}
          <PollComponent polls={post.polls} />

          {/* Engagement Metrics */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1 text-white/60 hover:text-pink-400 transition-colors cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  {XService.formatEngagementNumber(post.public_metrics.like_count)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/60 hover:text-blue-400 transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  {XService.formatEngagementNumber(post.public_metrics.reply_count)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/60 hover:text-green-400 transition-colors cursor-pointer">
                <Repeat2 className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  {XService.formatEngagementNumber(post.public_metrics.retweet_count)}
                </span>
              </div>
            </div>

            <motion.a
              href={`https://x.com/${post.author.username}/status/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">View</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const XUpdatesSection: React.FC = () => {
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  const checkApiConfiguration = useCallback(() => {
    const bearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
    return bearerToken && bearerToken !== 'your_x_api_bearer_token_here';
  }, []);

  const fetchPosts = useCallback(async () => {
    // Check if API is configured
    if (!checkApiConfiguration()) {
      setIsApiConfigured(false);
      setLoading(false);
      return;
    }

    setIsApiConfigured(true);

    try {
      setError(null);
      const xPosts = await xService.fetchUserPosts(5);
      setPosts(xPosts);
    } catch (err) {
      console.error('Failed to fetch X posts:', err);
      setError('Unable to load latest updates. Please check back later.');
    } finally {
      setLoading(false);
    }
  }, [checkApiConfiguration]);

  useEffect(() => {
    fetchPosts();

    // Cleanup on unmount
    return () => {
      xService.destroy();
    };
  }, [fetchPosts]);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-background/95 overflow-hidden">
      {/* Pipeline Background */}
      <PipelineBackground className="opacity-30" />

      {/* Content with glass morphism overlay */}
      <div className="relative z-10 bg-background/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4 sm:mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-3 sm:px-4 py-2 mb-4">
                <XLogo className="w-4 h-4 text-white/80" />
                <span className="text-xs sm:text-sm text-white/80">Latest Updates</span>
              </div>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                Recent News
              </span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg text-white/70 max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
            >
              Stay updated with FlowsyAI's latest developments, features, and community highlights.
            </motion.p>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <XSkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          {/* API Configuration Required State */}
          <AnimatePresence>
            {!isApiConfigured && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8 max-w-lg mx-auto">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <XLogo className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Real-Time X Integration</h3>
                    <p className="text-white/70 text-sm">
                      Connect with FlowsyAI's live X feed for the latest updates, announcements, and community highlights.
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span>Live posts and media</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <span>Real engagement metrics</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <span>Automatic updates</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <p className="text-white/80 text-sm mb-2">
                      <strong>For Developers:</strong>
                    </p>
                    <p className="text-white/60 text-xs">
                      Configure <code className="bg-white/10 px-1 rounded">VITE_TWITTER_BEARER_TOKEN</code> in your environment to enable live X integration.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* API Error State */}
          <AnimatePresence>
            {error && !loading && isApiConfigured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-md mx-auto">
                  <XLogo className="w-8 h-8 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 mb-4">{error}</p>
                  <p className="text-white/60 text-sm">
                    Please check your X API configuration and try again.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* X Posts Grid */}
          <AnimatePresence>
            {!loading && !error && posts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
              >
                {posts.map((post, index) => (
                  <XCard key={post.id} post={post} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default XUpdatesSection;
