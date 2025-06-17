import React, { useRef } from 'react';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PipelineBackground from '@/components/landing/PipelineBackground';
import TokenWidget from '@/components/ui/TokenWidget';

// Custom icons as SVG components
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DexScreenerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const HeroSectionNoMotion: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      id="hero"
      className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-black animate-fade-in"
    >
      {/* Pipeline Background */}
      <PipelineBackground className="z-0" />

      {/* Light Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Hero Content */}
      <div className="hero-content max-w-4xl px-6 py-12 z-20 relative text-center animate-slide-up">
        {/* Logo Video Section */}
        <div
          className="mb-16 flex justify-center animate-scale-in"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="relative w-full max-w-2xl aspect-video bg-black/50 rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50">
            <video
              ref={videoRef}
              src="/background-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Compact Floating Action Hub */}
        <div
          className="relative max-w-4xl mx-auto animate-scale-in"
          style={{ animationDelay: '1.1s' }}
        >
          {/* Dynamic Horizontal Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
            {/* Primary CTA - Join Waitlist */}
            <div
              className="group cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all duration-300 animate-slide-left"
              style={{ animationDelay: '1.3s' }}
            >
              <Link to="/waitlist" className="block relative">
                <div className="relative backdrop-blur-xl bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 border border-violet-500/30 rounded-xl p-[1px] group-hover:border-cyan-400/60 transition-all duration-500 shadow-xl group-hover:shadow-violet-500/25">
                  <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl px-8 py-5 overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-cyan-500/20 animate-gradient-x"></div>
                    </div>

                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-violet-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                          Join Waitlist
                        </div>
                        <div className="text-xs text-white/60">Be first to access</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Buy $FlowAI Button */}
            <div
              className="group cursor-pointer hover:scale-108 hover:-translate-y-2 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: '1.5s' }}
            >
              <a
                href="https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative"
              >
                <div className="relative backdrop-blur-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-[1px] group-hover:border-emerald-400/60 transition-all duration-500 shadow-lg group-hover:shadow-emerald-500/25">
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-xl px-5 py-3 overflow-hidden">
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <DexScreenerIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                          Buy $FlowAI
                        </div>
                        <div className="text-xs text-white/50">DexScreener</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-emerald-400/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Community Button */}
            <div
              className="group cursor-pointer hover:scale-108 hover:-translate-y-2 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: '1.7s' }}
            >
              <a
                href="https://t.me/+jNmtj8qUUtMxOTVk"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative"
              >
                <div className="relative backdrop-blur-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-[1px] group-hover:border-cyan-400/60 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/25">
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-xl px-5 py-3 overflow-hidden">
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                        <TelegramIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                          Community
                        </div>
                        <div className="text-xs text-white/50">Telegram</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-cyan-400/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Follow X Button */}
            <div
              className="group cursor-pointer hover:scale-108 hover:-translate-y-2 transition-all duration-300 animate-slide-right"
              style={{ animationDelay: '1.9s' }}
            >
              <a
                href="https://x.com/FlowsyAI"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative"
              >
                <div className="relative backdrop-blur-lg bg-gradient-to-r from-gray-600/10 to-slate-600/10 border border-gray-500/30 rounded-xl p-[1px] group-hover:border-gray-400/60 transition-all duration-500 shadow-lg group-hover:shadow-gray-500/25">
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-xl px-5 py-3 overflow-hidden">
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-gray-600 to-slate-700 p-2 rounded-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <TwitterIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold bg-gradient-to-r from-gray-300 to-slate-300 bg-clip-text text-transparent">
                          Follow X
                        </div>
                        <div className="text-xs text-white/50">@FlowsyAI</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-gray-400/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Token Widget */}
          <div
            className="mt-12 flex justify-center animate-slide-up"
            style={{ animationDelay: '2.1s' }}
          >
            <TokenWidget compact className="max-w-md" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
        
        .animate-slide-left {
          animation: slide-left 0.6s ease-out both;
        }
        
        .animate-slide-right {
          animation: slide-right 0.6s ease-out both;
        }
        
        .animate-scale-in {
          animation: scale-in 1s ease-out both;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease-in-out infinite;
        }
        
        .hover\\:scale-108:hover {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};

export default HeroSectionNoMotion;
