import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { pedidoService } from '../services/api'; // Assuming api.ts exports pedidoService
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge'; // Using shadcn Badge
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Skeleton } from '../components/ui/skeleton'; // Using shadcn Skeleton
import { 
  Plus, FileText, Clock, CheckCircle, RefreshCw, Calendar, 
  Search, Filter, Download, User, Package, AlertCircle, XCircle, Info, ChevronRight
} from 'lucide-react';

// Define the type for a Pedido object based on backend model
interface Pedido {
  id: number;
  numeroPedido: string;
  nomeCliente: string;
  dataRegistro: string; // Assuming ISO string format
  horarioPropostoRetirada: string; // Assuming ISO string format
  horarioAprovadoRetirada?: string | null; // Optional or null
  status: 'PENDENTE' | 'APROVADO' | 'REAGENDADO' | 'CONCLUIDO' | 'CANCELADO';
  // Add other relevant fields if needed
}

// Type for location state
interface LocationState {
  success?: string;
}

// Helper function to format date and time
const formatDateTime = (dateTimeStr: string | null | undefined): string => {
  if (!dateTimeStr) return '--';
  try {
    const date = new Date(dateTimeStr);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '--';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return '--';
  }
};

// Mapping status to Badge variants
const statusVariantMap: { [key in Pedido['status']]: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' } = {
  PENDENTE: 'warning',
  APROVADO: 'success',
  REAGENDADO: 'info',
  CONCLUIDO: 'default', // Or a specific style for completed
  CANCELADO: 'destructive',
};

const VendedorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>('todos');
  const [successMessage, setSuccessMessage] = useState<string>(state?.success || '');

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data: Pedido[] = await pedidoService.getPedidosVendedor();
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Falha ao carregar os pedidos. Tente atualizar a página.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  useEffect(() => {
    if (state?.success) {
      setSuccessMessage(state.success);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
        // Clean the state from location history
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, location.pathname, navigate]);

  const handleNovoPedido = () => {
    navigate('/vendedor/novo-pedido');
  };

  const handleVerPedido = (id: number) => {
    navigate(`/vendedor/pedido/${id}`);
  };

  const filteredPedidos = pedidos.filter(pedido => {
    if (activeTab === 'todos') return true;
    return pedido.status.toLowerCase() === activeTab;
  });

  const getTabCount = (statusKey: string): number => {
    if (statusKey === 'todos') return pedidos.length;
    return pedidos.filter(p => p.status.toLowerCase() === statusKey).length;
  };

  const renderSkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-4 w-20" /></TableHead>
          <TableHead><Skeleton className="h-4 w-32" /></TableHead>
          <TableHead><Skeleton className="h-4 w-24" /></TableHead>
          <TableHead><Skeleton className="h-4 w-24" /></TableHead>
          <TableHead><Skeleton className="h-4 w-20" /></TableHead>
          <TableHead className="text-right"><Skeleton className="h-4 w-16" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-full" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
      <p className="mt-1 text-sm text-gray-500">
        {activeTab === 'todos' 
          ? 'Você ainda não criou nenhum pedido.' 
          : `Não há pedidos com status "${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}".`}
      </p>
      {activeTab === 'todos' && (
        <div className="mt-6">
          <Button onClick={handleNovoPedido}>
            <Plus className="mr-2 h-4 w-4" /> Criar Novo Pedido
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */} 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Seu Dashboard</h1>
          <p className="text-gray-600 mt-1">Acompanhe e gerencie seus pedidos de retirada.</p>
        </div>
        <Button onClick={handleNovoPedido} size="lg" className="shadow-sm">
          <Plus className="mr-2 h-5 w-5" /> Novo Pedido
        </Button>
      </div>

      {/* Success Message */} 
      {successMessage && (
        <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertTitle className="font-semibold">Sucesso!</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
          <button onClick={() => setSuccessMessage('')} className="absolute top-2 right-2 p-1 rounded-md hover:bg-green-100">
            <XCircle className="h-4 w-4 text-green-600" />
          </button>
        </Alert>
      )}

      {/* Error Message */} 
      {error && !loading && (
         <Alert variant="destructive">
           <AlertCircle className="h-5 w-5" />
           <AlertTitle>Erro ao Carregar Pedidos</AlertTitle>
           <AlertDescription>
             {error}
             <Button variant="link" size="sm" onClick={fetchPedidos} className="ml-2 p-0 h-auto text-red-700">
               Tentar novamente
             </Button>
           </AlertDescription>
         </Alert>
      )}

      {/* Main Content Card */} 
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 p-4 sm:px-6 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-lg font-semibold">Meus Pedidos</CardTitle>
            <div className="flex items-center space-x-2">
              {/* Add Search/Filter inputs here if needed */}
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={fetchPedidos} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      <span className="ml-2 hidden sm:inline">Atualizar</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Atualizar lista</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="border-b rounded-none px-4 sm:px-6 bg-gray-50/50 w-full justify-start overflow-x-auto">
              {[ 'todos', 'pendente', 'aprovado', 'reagendado', 'concluido', 'cancelado'].map(statusKey => (
                <TabsTrigger key={statusKey} value={statusKey} className="relative capitalize">
                  {statusKey.replace('_', ' ')}
                  <Badge variant={statusKey === 'todos' ? 'secondary' : statusVariantMap[statusKey.toUpperCase() as Pedido['status']] || 'default'} className="ml-2 px-1.5 py-0.5 text-xs font-normal">
                    {getTabCount(statusKey)}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="p-4 sm:p-6">
              {loading ? (
                renderSkeletonTable()
              ) : filteredPedidos.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Nº Pedido</TableHead>
                        <TableHead className="whitespace-nowrap">Cliente</TableHead>
                        <TableHead className="whitespace-nowrap">Data Registro</TableHead>
                        <TableHead className="whitespace-nowrap">Horário Proposto</TableHead>
                        <TableHead className="whitespace-nowrap">Horário Confirmado</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right"></TableHead> {/* Actions */} 
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPedidos.map((pedido) => (
                        <TableRow 
                          key={pedido.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleVerPedido(pedido.id)}
                        >
                          <TableCell className="font-medium text-gray-800">{pedido.numeroPedido || '--'}</TableCell>
                          <TableCell className="text-gray-600">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              <span>{pedido.nomeCliente || '--'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 whitespace-nowrap">{formatDateTime(pedido.dataRegistro)}</TableCell>
                          <TableCell className="text-gray-600 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              {formatDateTime(pedido.horarioPropostoRetirada)}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              {formatDateTime(pedido.horarioAprovadoRetirada)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariantMap[pedido.status] || 'default'} className="capitalize">
                              {pedido.status.toLowerCase().replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-700"
                              onClick={(e) => { e.stopPropagation(); handleVerPedido(pedido.id); }}
                            >
                              Ver Detalhes <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                renderEmptyState()
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Optional: Add other cards or sections like quick stats, recent activity, etc. */}
    </div>
  );
};

export default VendedorDashboard;

