/**
 * Account Dashboard - Temporarily disabled
 */

import React from 'react';
import ComingSoonPage from '@/components/ComingSoonPage';

const AccountDashboard: React.FC = () => {
  const dashboardIcon = (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  return (
    <ComingSoonPage
      title="Dashboard Coming Soon"
      description="User dashboards and account management are currently under development. Join our waitlist to be notified when this feature is ready!"
      icon={dashboardIcon}
    />
  );
};

export default AccountDashboard;
