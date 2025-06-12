/**
 * Coming Soon Page Component - Reusable for all inactive features
 */

import React from 'react';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title = "Feature Coming Soon",
  description = "This feature is currently under development. Join our waitlist to be notified when it's ready!",
  icon
}) => {
  const defaultIcon = (
    <svg
      className="w-8 h-8 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-md mx-auto text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {icon || defaultIcon}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-300 mb-6">
            {description}
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/waitlist'}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Join Waitlist
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            Back to Home
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-sm text-gray-400">
            Want to learn more about FlowsyAI?
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="/features"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Pricing
            </a>
            <a
              href="/roadmap"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Roadmap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
