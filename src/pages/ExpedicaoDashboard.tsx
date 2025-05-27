import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { pedidoService } from '../services/api'; // Assuming api.ts exports pedidoService
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Skeleton } from '../components/ui/skeleton';
import { 
  CheckCircle, RefreshCw, Calendar, Filter, Download, User, 
  Package, Clock, FileText, AlertCircle, BarChart, XCircle, ChevronRight, Edit
} from 'lucide-react';

// Define the type for a Pedido object based on backend model
interface Pedido {
  id: number;
  numeroPedido: string;
  nomeCliente: string;
  vendedor?: { name: string }; // Optional vendor info
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
  CONCLUIDO: 'default',
  CANCELADO: 'destructive',
};

const ExpedicaoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>('pendente'); // Default to 'pendente'
  const [successMessage, setSuccessMessage] = useState<string>(state?.success || '');
  const [stats, setStats] = useState({ pendentes: 0, aprovados: 0, reagendados: 0, concluidos: 0, total: 0 });

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data: Pedido[] = await pedidoService.getPedidosExpedicao();
      setPedidos(data);

      // Calculate stats
      const pendentes = data.filter(p => p.status === 'PENDENTE').length;
      const aprovados = data.filter(p => p.status === 'APROVADO').length;
      const reagendados = data.filter(p => p.status === 'REAGENDADO').length;
      const concluidos = data.filter(p => p.status === 'CONCLUIDO').length;
      
      setStats({
        pendentes,
        aprovados,
        reagendados,
        concluidos,
        total: data.length
      });

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
      const timer = setTimeout(() => {
        setSuccessMessage('');
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, location.pathname, navigate]);

  const handleVerPedido = (id: number) => {
    navigate(`/expedicao/pedido/${id}`);
  };

  const handleAprovarHorario = async (id: number) => {
    try {
      setError('');
      setSuccessMessage('');
      await pedidoService.aprovarHorario(id);
      setSuccessMessage('Horário aprovado com sucesso!');
      fetchPedidos(); // Refresh list
    } catch (err) {
      console.error('Erro ao aprovar horário:', err);
      setError('Não foi possível aprovar o horário. Tente novamente.');
    }
  };

  const handleReagendarHorario = (id: number) => {
    navigate(`/expedicao/reagendar/${id}`);
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
          <TableHead className="text-right"><Skeleton className="h-4 w-24" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
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
          ? 'Não há pedidos registrados no sistema.' 
          : `Não há pedidos com status "${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}".`}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */} 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard da Expedição</h1>
          <p className="text-gray-600 mt-1">Gerencie os agendamentos de retirada dos clientes.</p>
        </div>
        <Button onClick={fetchPedidos} size="lg" variant="outline" className="shadow-sm" disabled={loading}>
          <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} /> Atualizar Dados
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
      {error && (
         <Alert variant="destructive">
           <AlertCircle className="h-5 w-5" />
           <AlertTitle>Erro</AlertTitle>
           <AlertDescription>
             {error}
             <Button variant="link" size="sm" onClick={fetchPedidos} className="ml-2 p-0 h-auto text-red-700">
               Tentar novamente
             </Button>
           </AlertDescription>
         </Alert>
      )}

      {/* Stats Cards */} 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[ 
          { title: 'Pendentes', value: stats.pendentes, icon: Clock, color: 'yellow', tab: 'pendente' },
          { title: 'Aprovados', value: stats.aprovados, icon: CheckCircle, color: 'green', tab: 'aprovado' },
          { title: 'Reagendados', value: stats.reagendados, icon: Calendar, color: 'blue', tab: 'reagendado' },
          { title: 'Total', value: stats.total, icon: BarChart, color: 'purple', tab: 'todos' },
        ].map(stat => (
          <Card key={stat.title} className={`border-${stat.color}-200 bg-${stat.color}-50 shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${stat.color}-800`}>{stat.title}</p>
                  <h3 className={`text-2xl font-bold text-${stat.color}-900 mt-1`}>{loading ? <Skeleton className="h-7 w-12 inline-block" /> : stat.value}</h3>
                </div>
                <div className={`h-10 w-10 bg-${stat.color}-100 rounded-full flex items-center justify-center text-${stat.color}-600`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2">
                <Button 
                  variant="link" 
                  size="sm" 
                  className={`text-${stat.color}-800 hover:text-${stat.color}-900 p-0 h-auto font-medium`}
                  onClick={() => setActiveTab(stat.tab)}
                >
                  Ver {stat.tab === 'todos' ? 'todos' : stat.tab} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Card - Pedidos Table */} 
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 p-4 sm:px-6 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-lg font-semibold">Gerenciamento de Pedidos</CardTitle>
            {/* Add Filters here if needed */}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="border-b rounded-none px-4 sm:px-6 bg-gray-50/50 w-full justify-start overflow-x-auto">
              {[ 'pendente', 'aprovado', 'reagendado', 'concluido', 'cancelado', 'todos'].map(statusKey => (
                <TabsTrigger key={statusKey} value={statusKey} className="relative capitalize">
                  {statusKey.replace('_', ' ')}
                  <Badge variant={statusKey === 'todos' ? 'secondary' : statusVariantMap[statusKey.toUpperCase() as Pedido['status']] || 'default'} className="ml-2 px-1.5 py-0.5 text-xs font-normal">
                    {loading ? <Skeleton className="h-3 w-3 inline-block" /> : getTabCount(statusKey)}
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
                        <TableHead className="whitespace-nowrap">Vendedor</TableHead>
                        <TableHead className="whitespace-nowrap">Data Registro</TableHead>
                        <TableHead className="whitespace-nowrap">Horário Proposto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPedidos.map((pedido) => (
                        <TableRow 
                          key={pedido.id} 
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium text-gray-800">{pedido.numeroPedido || '--'}</TableCell>
                          <TableCell className="text-gray-600">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              <span>{pedido.nomeCliente || '--'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{pedido.vendedor?.name || '--'}</TableCell>
                          <TableCell className="text-gray-600 whitespace-nowrap">{formatDateTime(pedido.dataRegistro)}</TableCell>
                          <TableCell className="text-gray-600 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              {formatDateTime(pedido.horarioPropostoRetirada)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariantMap[pedido.status] || 'default'} className="capitalize">
                              {pedido.status.toLowerCase().replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <TooltipProvider>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8"
                                    onClick={() => handleVerPedido(pedido.id)}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Ver Detalhes</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            {pedido.status === 'PENDENTE' && (
                              <>
                                <TooltipProvider>
                                  <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-gray-500 hover:text-green-600 hover:bg-green-50 h-8 w-8 ml-1"
                                        onClick={(e) => { e.stopPropagation(); handleAprovarHorario(pedido.id); }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Aprovar Horário</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-gray-500 hover:text-orange-600 hover:bg-orange-50 h-8 w-8 ml-1"
                                        onClick={(e) => { e.stopPropagation(); handleReagendarHorario(pedido.id); }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Sugerir Novo Horário</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}
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
    </div>
  );
};

export default ExpedicaoDashboard;

