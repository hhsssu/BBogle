import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = (): React.ReactElement | null => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // 로딩 중일 때 흰 배경 표시
    return (
      <div
        className="loading-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      ></div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
