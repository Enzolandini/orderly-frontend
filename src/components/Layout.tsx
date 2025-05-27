import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api'; // Assuming api.ts exports authService
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut, User, Package, Bell, Settings, HelpCircle, LayoutDashboard, FilePlus, History } from 'lucide-react';

// Define props type
interface LayoutProps {
  userRole: 'VENDEDOR' | 'EXPEDICAO' | 'ADMIN' | null; // Allow null if user might not be logged in initially
}

// Helper to get initials from name
const getInitials = (name: string = ''): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'; // Default to 'U' if name is empty
};

const Layout: React.FC<LayoutProps> = ({ userRole }) => {
  const navigate = useNavigate();
  // Assuming getCurrentUser returns an object like { name: string, email: string } or null
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getNavigationLinks = () => {
    switch (userRole) {
      case 'VENDEDOR':
        return [
          { path: '/vendedor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/vendedor/novo-pedido', label: 'Novo Pedido', icon: FilePlus },
          { path: '/vendedor/historico', label: 'Histórico', icon: History },
        ];
      case 'EXPEDICAO':
        return [
          { path: '/expedicao/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/expedicao/pedidos', label: 'Pedidos Pendentes', icon: Package },
          { path: '/expedicao/historico', label: 'Histórico', icon: History },
        ];
      // Add ADMIN case if needed
      default:
        return [];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center h-16">
          <Package className="h-7 w-7 text-blue-600 mr-2" />
          <h1 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
            Agendamento
          </h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navigationLinks.map((link) => (
            <Button
              key={link.path}
              variant={window.location.pathname.startsWith(link.path) ? 'secondary' : 'ghost'}
              className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              asChild
            >
              <Link to={link.path}>
                <link.icon className="mr-3 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 mt-auto">
          {/* Footer links or info can go here if needed */}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64"> {/* Adjust margin to match sidebar width */} 
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 h-16 flex items-center px-6">
          <div className="flex-grow">{/* Placeholder for potential breadcrumbs or page title */}</div>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white text-xs rounded px-2 py-1">
                  <p>Ajuda & Suporte</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {/* Example notification badge */}
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white text-xs rounded px-2 py-1">
                  <p>Notificações</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || 'Usuário'} />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'email@exemplo.com'}
                    </p>
                    <p className="text-xs leading-none text-blue-600 font-semibold pt-1">
                      {userRole === 'VENDEDOR' ? 'Perfil: Vendedor' : userRole === 'EXPEDICAO' ? 'Perfil: Expedição' : 'Perfil: Admin'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-6 overflow-auto">
          <Outlet /> {/* Renders the matched child route component */} 
        </main>

        {/* Optional Footer within main content area if needed */}
        {/* <footer className="bg-white border-t border-gray-200 p-4 mt-auto"> ... </footer> */}
      </div>
    </div>
  );
};

export default Layout;

