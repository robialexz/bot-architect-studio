/**
 * Simple Auth Page - Temporarily disabled
 */

import React from 'react';
import ComingSoonPage from '@/components/ComingSoonPage';

const AuthPageSimple: React.FC = () => {
  const authIcon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  return (
    <ComingSoonPage
      title="Authentication Coming Soon"
      description="User accounts and authentication are currently under development. Join our waitlist to be notified when this feature is ready!"
      icon={authIcon}
    />
  );
};

export default AuthPageSimple;
