import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidoService } from '../services/api'; // Assuming api.ts exports pedidoService
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Progress } from '../components/ui/progress';
import { 
  ArrowLeft, Upload, Calendar, Clock, FileText, AlertCircle, 
  Info, CheckCircle, HelpCircle, XCircle, Loader2, ListChecks, UserCheck
} from 'lucide-react';

// Types
interface ItemPedidoPreview {
  codigo: string;
  descricao: string;
  quantidade: number;
}

interface PreviewData {
  nomeCliente: string;
  numeroPedido: string;
  itens: ItemPedidoPreview[];
}

const NovoPedido: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [nomeCliente, setNomeCliente] = useState<string>('');
  const [numeroPedido, setNumeroPedido] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [hora, setHora] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [step, setStep] = useState<number>(1); // 1: Upload, 2: Confirm/Schedule

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError('');
    setPreviewData(null);
    setFile(null);
    setFileName('');

    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setFileError('Formato inválido. Por favor, selecione um arquivo PDF.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setFileError('Arquivo muito grande. O limite é 10MB.');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setUploading(true);
    setError(''); // Clear previous errors

    // Simulate PDF processing and data extraction
    // In a real app, this would be an API call
    setTimeout(() => {
      // Simulate success or failure
      const success = Math.random() > 0.1; // 90% success rate for demo
      if (success) {
        const extractedData: PreviewData = {
          nomeCliente: 'Cliente Exemplo Ltda',
          numeroPedido: 'PED' + Math.floor(1000 + Math.random() * 9000),
          itens: [
            { codigo: 'PROD-001', descricao: 'Componente Eletrônico X', quantidade: 15 },
            { codigo: 'PROD-007', descricao: 'Cabo de Conexão Blindado', quantidade: 5 },
            { codigo: 'PROD-023', descricao: 'Fonte de Alimentação 12V', quantidade: 2 },
          ]
        };
        setPreviewData(extractedData);
        setNomeCliente(extractedData.nomeCliente);
        setNumeroPedido(extractedData.numeroPedido);
        setStep(2);
      } else {
        setError('Falha ao processar o PDF. Verifique o arquivo ou tente novamente.');
        setFile(null);
        setFileName('');
      }
      setUploading(false);
    }, 2000); // Simulate 2 seconds processing time

  }, []);

  const handleVoltar = useCallback(() => {
    navigate('/vendedor/dashboard');
  }, [navigate]);

  const handleVoltarParaUpload = useCallback(() => {
    setStep(1);
    setFile(null);
    setFileName('');
    setPreviewData(null);
    setNomeCliente('');
    setNumeroPedido('');
    setData('');
    setHora('');
    setObservacoes('');
    setError('');
    setFileError('');
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!file || !previewData) {
      setError('Erro interno: dados do pedido ou arquivo ausentes.');
      return;
    }

    if (!data || !hora) {
      setError('Por favor, informe a data e hora desejada para retirada.');
      return;
    }

    // Basic date/time validation (ensure it's not in the past)
    const proposedDateTime = new Date(`${data}T${hora}`);
    if (proposedDateTime <= new Date()) {
        setError('A data e hora da retirada devem ser no futuro.');
        return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('arquivo', file);
      // Send extracted data for backend validation/use, but backend should re-process PDF as source of truth
      formData.append('nomeCliente', nomeCliente); 
      formData.append('numeroPedido', numeroPedido);
      formData.append('dataHoraRetirada', proposedDateTime.toISOString()); // Send in ISO format
      formData.append('observacoes', observacoes);

      await pedidoService.criarPedido(formData);

      navigate('/vendedor/dashboard', {
        state: { success: 'Pedido enviado com sucesso! A expedição analisará o agendamento.' }
      });
    } catch (err) {
      console.error('Erro ao enviar pedido:', err);
      setError('Falha ao enviar o pedido. Verifique os dados ou tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min attribute in date input
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */} 
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={step === 1 ? handleVoltar : handleVoltarParaUpload} className="mr-4 h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Novo Pedido de Retirada</h1>
          <p className="text-gray-600 mt-1">
            {step === 1 ? 'Faça o upload do PDF do pedido.' : 'Confirme os dados e agende a retirada.'}
          </p>
        </div>
      </div>

      {/* Step Indicator (Optional) */} 
      {/* <Progress value={step === 1 ? 33 : 66} className="w-full h-2" /> */}

      {/* Step 1: Upload */} 
      {step === 1 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center"><Upload className="mr-2 h-5 w-5 text-blue-600" /> Upload do Pedido PDF</CardTitle>
            <CardDescription>Selecione o arquivo PDF do pedido do cliente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="info" className="bg-blue-50 border-blue-200 text-blue-800">
              <Info className="h-5 w-5 text-blue-500" />
              <AlertTitle className="font-semibold">Instruções</AlertTitle>
              <AlertDescription>
                O arquivo deve ser PDF (máx 10MB). O sistema tentará extrair os dados automaticamente para sua conferência.
              </AlertDescription>
            </Alert>

            {fileError && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Erro no Arquivo</AlertTitle>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Erro no Processamento</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="font-medium text-blue-600 hover:text-blue-700">Clique para selecionar</span> ou arraste o PDF aqui.
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={uploading}
                />
              </Label>
              <p className="text-xs text-gray-500 mt-2">PDF (MAX. 10MB)</p>
            </div>

            {uploading && (
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processando arquivo...</span>
              </div>
            )}

            {fileName && !uploading && (
              <div className="text-center text-sm text-green-700 font-medium bg-green-50 p-3 rounded-md border border-green-200">
                <CheckCircle className="inline-block mr-2 h-4 w-4" /> Arquivo selecionado: {fileName}
              </div>
            )}
          </CardContent>
          {/* Footer can be added if needed, e.g., for cancel button */} 
        </Card>
      )}

      {/* Step 2: Confirm & Schedule */} 
      {step === 2 && previewData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Scheduling & Details */} 
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center"><UserCheck className="mr-2 h-5 w-5 text-blue-600" /> Confirmar Dados do Pedido</CardTitle>
                  <CardDescription>Verifique os dados extraídos e preencha as informações de agendamento.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numeroPedido">Número do Pedido</Label>
                      <Input id="numeroPedido" value={numeroPedido} onChange={(e) => setNumeroPedido(e.target.value)} required />
                      <p className="text-xs text-gray-500 mt-1">Extraído do PDF.</p>
                    </div>
                    <div>
                      <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                      <Input id="nomeCliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required />
                      <p className="text-xs text-gray-500 mt-1">Extraído do PDF.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data">Data para Retirada *</Label>
                      <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} required min={getTodayDate()} />
                    </div>
                    <div>
                      <Label htmlFor="hora">Horário para Retirada *</Label>
                      <Input id="hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="observacoes">Observações (Opcional)</Label>
                    <Textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Alguma informação adicional para a expedição? (Ex: veículo, urgência)"
                      rows={3}
                      maxLength={300}
                    />
                     <p className="text-xs text-gray-500 mt-1">Máximo 300 caracteres.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Extracted Items */} 
            <div className="lg:col-span-1">
              <Card className="shadow-sm sticky top-20"> {/* Sticky for longer forms */} 
                <CardHeader>
                  <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-green-600" /> Itens Extraídos</CardTitle>
                  <CardDescription>Itens identificados no PDF.</CardDescription>
                </CardHeader>
                <CardContent>
                  {previewData.itens && previewData.itens.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {previewData.itens.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800 truncate pr-2" title={item.descricao}>{item.descricao}</span>
                            <Badge variant="secondary">Qtd: {item.quantidade}</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Código: {item.codigo}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Nenhum item extraído.</p>
                  )}
                  <Alert variant="warning" className="mt-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                    <HelpCircle className="h-5 w-5 text-yellow-500" />
                    <AlertTitle className="font-semibold">Atenção</AlertTitle>
                    <AlertDescription>
                      Confira os itens. A expedição usará o PDF original como referência final.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Actions */} 
          <div className="flex justify-between items-center pt-6 border-t mt-6">
            <Button type="button" variant="outline" onClick={handleVoltarParaUpload} disabled={loading}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Upload
            </Button>
            <div className="flex space-x-3">
              <Button type="button" variant="ghost" onClick={handleVoltar} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {loading ? 'Enviando...' : 'Confirmar e Enviar'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default NovoPedido;

