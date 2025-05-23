
import React from 'react';
import { Search, ShoppingCart, User, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cartItems: number;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  cartItems,
  onMenuClick
}) => {
  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-gray-800"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">PiercerHub</h1>
              <span className="text-sm text-gray-300 hidden sm:block">Marketplace</span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Busque por produtos específicos (ex: argola em titânio 8mm)"
                className="pl-10 bg-white text-black border-0 focus:ring-2 focus:ring-gray-300"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 hidden sm:flex">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
                  {cartItems}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
