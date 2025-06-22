
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Pizza, Users, BarChart, Settings, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/new-order', label: 'Novo Pedido', icon: ClipboardList },
  { path: '/orders', label: 'Pedidos', icon: ClipboardList },
  { path: '/menu', label: 'Cardápio', icon: Pizza },
  { path: '/customers', label: 'Clientes', icon: Users },
  { path: '/reports', label: 'Relatórios', icon: BarChart },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <h1 
                className="text-2xl font-bold text-orange-600 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                🍕 Pizza Manager
              </h1>
              {user?.tenantId && (
                <Badge variant="secondary">Pizzaria: {user.name}</Badge>
              )}
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                if (item.path === '/super-admin' && user?.role !== 'super_admin') {
                  return null;
                }
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className="flex items-center space-x-2"
                    size="sm"
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {user?.role === 'super_admin' && (
                <Button
                  variant={location.pathname === '/super-admin' ? "default" : "ghost"}
                  onClick={() => navigate('/super-admin')}
                  className="flex items-center space-x-2"
                  size="sm"
                >
                  <Settings size={16} />
                  <span>Super Admin</span>
                </Button>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Olá, {user?.name}
            </span>
            <Button variant="outline" onClick={logout} size="sm">
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
