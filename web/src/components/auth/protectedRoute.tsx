// src/components/auth/protectedRoute.tsx
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/context/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // ou <LoadingSpinner />

  // Verificação direta: se não tem token, redireciona
  if (!token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}