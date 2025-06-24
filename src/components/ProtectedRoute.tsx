
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'attendant';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Super admin tem acesso a tudo
  if (user.role === 'super_admin') {
    return <>{children}</>;
  }

  // Verifica se o usuário tem o papel necessário
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verifica se o usuário está ativo
  if (!user.isActive) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuários admin e attendant devem ter um tenantId
  if ((user.role === 'admin' || user.role === 'attendant') && !user.tenantId) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
