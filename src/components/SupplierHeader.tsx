
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

const SupplierHeader = () => {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/supplier/products',
      label: 'Produtos',
      icon: Package
    },
    {
      path: '/supplier/orders',
      label: 'Pedidos',
      icon: ShoppingCart
    },
    {
      path: '/supplier/reports',
      label: 'Relatórios',
      icon: BarChart3
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome da Empresa */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {profile?.full_name || 'Minha Loja'}
              </span>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Menu do Usuário */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden md:block">Perfil</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:block">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SupplierHeader;
