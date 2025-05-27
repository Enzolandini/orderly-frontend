import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pedidoService } from '../services/api';
import { 
  Button, Card, CardContent, CardHeader, CardFooter, Badge, Alert,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  StatusBadge, Tooltip, Skeleton, SkeletonText
} from '../components/ui';
import { 
  ArrowLeft, Download, CheckCircle, RefreshCw, Clock, Calendar,
  User, Package, FileText, ShoppingCart, DollarSign, Truck
} from 'lucide-react';

const DetalhesPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const data = await pedidoService.getPedidoById(id);
        setPedido(data);
        
        // Determinar o papel do usuário a partir da URL
        const path = window.location.pathname;
        if (path.includes('/vendedor/')) {
          setUserRole('VENDEDOR');
        } else if (path.includes('/expedicao/')) {
          setUserRole('EXPEDICAO');
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do pedido:', err);
        setError('Não foi possível carregar os detalhes do pedido. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleVoltar = () => {
    if (userRole === 'VENDEDOR') {
      navigate('/vendedor/dashboard');
    } else if (userRole === 'EXPEDICAO') {
      navigate('/expedicao/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleAprovarHorario = async () => {
    try {
      await pedidoService.aprovarHorario(id);
      setSuccessMessage('Horário aprovado com sucesso!');
      // Recarregar os dados do pedido
      const updatedPedido = await pedidoService.getPedidoById(id);
      setPedido(updatedPedido);
      
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Erro ao aprovar horário:', err);
      setError('Não foi possível aprovar o horário. Por favor, tente novamente.');
    }
  };

  const handleReagendarHorario = () => {
    navigate(`/expedicao/reagendar/${id}`);
  };

  const handleDownloadPdf = () => {
    // Implementar download do PDF
    alert('Funcionalidade de download do PDF será implementada em breve.');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleVoltar} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader title="Carregando..." />
            <CardContent>
              <SkeletonText lines={6} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="Carregando..." />
            <CardContent>
              <SkeletonText lines={3} />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader title="Carregando..." />
          <CardContent>
            <SkeletonText lines={4} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert 
          variant="error" 
          title="Erro ao carregar pedido"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
        >
          {error}
          <div className="mt-4">
            <Button onClick={handleVoltar} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto p-4">
        <Alert 
          variant="warning" 
          title="Pedido não encontrado"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
        >
          <p>O pedido solicitado não foi encontrado ou você não tem permissão para acessá-lo.</p>
          <div className="mt-4">
            <Button onClick={handleVoltar} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {successMessage && (
        <Alert 
          variant="success" 
          title="Operação realizada com sucesso"
          icon={<CheckCircle className="h-5 w-5" />}
          dismissible
          onDismiss={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleVoltar} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedido #{pedido.numeroPedido}</h1>
            <p className="text-gray-500 mt-1">Detalhes completos do pedido e agendamento</p>
          </div>
        </div>
        <StatusBadge status={pedido.status} className="self-start sm:self-center" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader 
            title="Informações do Pedido" 
            icon={<Package className="h-5 w-5" />}
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Cliente</h3>
                </div>
                <p className="text-lg font-semibold">{pedido.nomeCliente}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Número do Pedido</h3>
                </div>
                <p className="text-lg font-semibold">{pedido.numeroPedido}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Data de Registro</h3>
                </div>
                <p className="font-semibold">{formatDateTime(pedido.dataRegistro)}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Vendedor</h3>
                </div>
                <p className="font-semibold">{pedido.vendedor?.name || 'N/A'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Horário Proposto</h3>
                </div>
                <p className="font-semibold">{formatDateTime(pedido.horarioPropostoRetirada)}</p>
              </div>
              
              {pedido.horarioAprovadoRetirada && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center text-gray-700 mb-2">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="font-medium">
                      {pedido.status === 'REAGENDADO' ? 'Novo Horário Sugerido' : 'Horário Aprovado'}
                    </h3>
                  </div>
                  <p className="font-semibold">{formatDateTime(pedido.horarioAprovadoRetirada)}</p>
                </div>
              )}
            </div>
            
            {pedido.observacoes && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Observações</h3>
                </div>
                <p className="whitespace-pre-line">{pedido.observacoes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={handleDownloadPdf}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF Original
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader 
            title="Ações" 
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <CardContent className="space-y-4">
            {userRole === 'EXPEDICAO' && pedido.status === 'PENDENTE' && (
              <div className="space-y-3">
                <Button 
                  className="w-full flex items-center justify-center" 
                  onClick={handleAprovarHorario}
                  icon={<CheckCircle className="mr-2 h-4 w-4" />}
                >
                  Aprovar Horário
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleReagendarHorario}
                  icon={<RefreshCw className="mr-2 h-4 w-4" />}
                >
                  Sugerir Novo Horário
                </Button>
              </div>
            )}
            
            {(pedido.status === 'APROVADO' || pedido.status === 'REAGENDADO') && (
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">
                      {pedido.status === 'APROVADO' 
                        ? 'Este pedido já foi aprovado.' 
                        : 'Um novo horário foi sugerido para este pedido.'}
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      {pedido.status === 'APROVADO'
                        ? 'O vendedor foi notificado sobre a aprovação.'
                        : 'O vendedor foi notificado sobre o novo horário sugerido.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {pedido.status === 'PENDENTE' && (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-yellow-800 font-medium">
                      Aguardando aprovação da expedição
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Este pedido está pendente de aprovação ou reagendamento pela equipe de expedição.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-800 font-medium">
                    Informações de Retirada
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Local: Expedição Central<br />
                    Endereço: Av. Principal, 1000<br />
                    Horário de Funcionamento: 08:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader 
          title="Itens do Pedido" 
          subtitle="Lista de produtos incluídos neste pedido"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedido.itens && pedido.itens.length > 0 ? (
                  pedido.itens.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell className="font-medium">{item.codigo}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell className="text-center">{item.quantidade}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell className="text-right">
                        {item.precoUnitario ? formatCurrency(item.precoUnitario) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.valorTotal ? formatCurrency(item.valorTotal) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-6 text-gray-500">
                      Nenhum item encontrado para este pedido.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {pedido.itens && pedido.itens.length > 0 && (
                <tfoot>
                  <tr className="border-t">
                    <td colSpan="5" className="px-4 py-3 text-right font-medium">Total:</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {formatCurrency(pedido.itens.reduce((total, item) => total + (item.valorTotal || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesPedido;
