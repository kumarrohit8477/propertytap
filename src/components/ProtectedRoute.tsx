import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { use_auth } from '@/hooks/use_auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = use_auth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#6b7280', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, is_admin, loading } = use_auth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#6b7280', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!is_admin) {
    return <Navigate to="/dashboard/properties" replace />;
  }

  return <>{children}</>;
}
