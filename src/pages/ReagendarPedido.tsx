import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pedidoService } from '../services/api';
import { 
  Card, CardHeader, CardContent, CardFooter, Button, Input, Alert,
  Textarea, Tooltip
} from '../components/ui';
import { 
  ArrowLeft, Calendar, Clock, FileText, AlertTriangle, 
  Info, CheckCircle, RefreshCw
} from 'lucide-react';

const ReagendarPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const data = await pedidoService.getPedidoById(id);
        setPedido(data);
        
        // Preencher observações se existirem
        if (data.observacoes) {
          setObservacoes(data.observacoes);
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

  const handleVoltar = () => {
    navigate('/expedicao/pedido/' + id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data || !hora) {
      setError('Por favor, informe a data e hora para reagendamento.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await pedidoService.reagendarPedido(id, {
        dataHoraReagendada: `${data}T${hora}`,
        observacoes: observacoes
      });
      
      navigate('/expedicao/dashboard', { 
        state: { success: 'Pedido reagendado com sucesso! O vendedor será notificado.' } 
      });
    } catch (err) {
      console.error('Erro ao reagendar pedido:', err);
      setError('Não foi possível reagendar o pedido. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleVoltar} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
        
        <Card>
          <CardHeader title="Carregando..." />
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !pedido) {
    return (
      <div className="container mx-auto p-4">
        <Alert 
          variant="error" 
          title="Erro ao carregar pedido"
          icon={<AlertTriangle className="h-5 w-5" />}
        >
          {error}
          <div className="mt-4">
            <Button onClick={() => navigate('/expedicao/dashboard')} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Dashboard
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleVoltar} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reagendar Pedido #{pedido?.numeroPedido}</h1>
          <p className="text-gray-500 mt-1">Sugira um novo horário para retirada</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader 
              title="Novo Horário" 
              subtitle="Informe a data e hora sugeridas para retirada"
              icon={<Calendar className="h-5 w-5" />}
            />
            <CardContent className="space-y-6">
              {error && (
                <Alert 
                  variant="error" 
                  title="Erro ao reagendar"
                  icon={<AlertTriangle className="h-5 w-5" />}
                >
                  {error}
                </Alert>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">Horário Atual</h3>
                    <p className="text-blue-700 mt-1">
                      O vendedor propôs a retirada para: <strong>{formatDateTime(pedido?.horarioPropostoRetirada)}</strong>
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      Informe abaixo um novo horário que seja mais adequado para a expedição.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    id="data"
                    label="Nova Data para Retirada"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                    hint="Selecione a nova data sugerida"
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    id="hora"
                    label="Novo Horário para Retirada"
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                    hint="Selecione o novo horário sugerido"
                    icon={<Clock className="h-4 w-4" />}
                  />
                </div>
              </div>
              
              <Textarea
                id="observacoes"
                label="Observações"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Explique o motivo do reagendamento ou forneça informações adicionais..."
                rows={4}
                maxLength={500}
                counter
                hint="Opcional: Adicione informações sobre o reagendamento"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader 
              title="Informações do Pedido" 
              subtitle="Detalhes do pedido a ser reagendado"
              icon={<FileText className="h-5 w-5" />}
            />
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Número do Pedido</h3>
                </div>
                <p className="font-semibold">{pedido?.numeroPedido}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Cliente</h3>
                </div>
                <p className="font-semibold">{pedido?.nomeCliente}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium">Horário Original</h3>
                </div>
                <p className="font-semibold">{formatDateTime(pedido?.horarioPropostoRetirada)}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Ao sugerir um novo horário, o vendedor será notificado automaticamente e poderá visualizar a alteração no sistema.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleVoltar}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            
            <div className="flex space-x-3">
              <Tooltip content="Recarregar informações do pedido">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Atualizar
                </Button>
              </Tooltip>
              
              <Button 
                type="submit" 
                isLoading={submitting}
                icon={<CheckCircle className="h-4 w-4" />}
              >
                Confirmar Reagendamento
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ReagendarPedido;
