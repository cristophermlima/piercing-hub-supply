
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.png';
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
    <header className="bg-gray-900 border-b border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome da Empresa */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="PiercerHub Logo" className="h-14 w-auto" />
              <span className="text-xl font-bold text-white">
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
                    isActive 
                      ? '' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
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
              className="flex items-center space-x-2 text-white hover:bg-white/10"
            >
              <User className="h-4 w-4" />
              <span className="hidden md:block">Perfil</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-primary hover:text-primary/90 hover:bg-white/10"
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
