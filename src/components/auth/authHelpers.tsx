import React from 'react';
import ProtectedRoute from '../ProtectedRoute';

// Specific route guards
export const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>
);

export const PremiumRoute: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ProtectedRoute requireAuth={true} requirePremium={true} fallbackComponent={fallback}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={false} redirectTo="/account">
    {children}
  </ProtectedRoute>
);
