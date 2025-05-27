import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api'; // Assuming api.ts exports authService
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Eye, EyeOff, LogIn, User, Lock, AlertCircle, HelpCircle } from 'lucide-react';

// Define types for state and props if needed, though simple state like strings/booleans often don't require explicit types here.

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Por favor, preencha o nome de usuário e a senha.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Assuming authService.login returns an object with a 'role' property
      const response = await authService.login(username, password);

      // Store token and user info (implementation depends on authService)
      // localStorage.setItem('token', response.token);
      // localStorage.setItem('user', JSON.stringify({ username: response.username, role: response.role }));

      if (response.role === 'VENDEDOR') {
        navigate('/vendedor/dashboard');
      } else if (response.role === 'EXPEDICAO') {
        navigate('/expedicao/dashboard');
      } else if (response.role === 'ADMIN') {
        navigate('/admin/dashboard'); // Assuming an admin route
      } else {
        // Fallback or handle unexpected roles
        setError('Perfil de usuário desconhecido.');
        // navigate('/'); // Or stay on login
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      // Provide a more user-friendly error message
      setError('Credenciais inválidas. Verifique seu usuário e senha.');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 p-6 text-center">
          {/* Optional: Add a logo here */}
          {/* <img src="/path/to/logo.png" alt="Logo" className="mx-auto h-12 w-auto mb-4" /> */}
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-800">Bem-vindo!</CardTitle>
          <CardDescription className="text-gray-600 mt-1">Acesse o Sistema de Agendamento</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertTitle className="font-semibold">Erro de Login</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  placeholder="Digite seu nome de usuário"
                  required
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="pl-10 pr-10" // Make space for the eye icon
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              {/* Removed 'Remember me' for simplicity, can be added back if needed */}
              {/* <div className="flex items-center">...</div> */}
              <div className="ml-auto"> {/* Pushes the link to the right */}
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center">
                        Esqueceu a senha?
                        <HelpCircle className="ml-1 h-3.5 w-3.5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white text-xs rounded px-2 py-1">
                      <p>Entre em contato com o administrador.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Submit button moved to CardFooter for better structure */}
          </form>
        </CardContent>

        <CardFooter className="p-6 bg-gray-50">
          <Button
            type="submit" // Connects to the form via form attribute or default behavior if inside form
            form="login-form" // Optional: Explicitly link if button is outside form tag
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition duration-150 ease-in-out shadow-sm"
            disabled={loading}
            onClick={(e) => { 
              // Need to trigger form submission manually if button is outside form tag
              // Or ensure the button is type="submit" and inside the form tag
              const form = document.querySelector('form'); 
              if (form) form.requestSubmit(); 
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Test credentials info - kept outside the card for clarity */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white p-2 rounded shadow">
        <p className="font-semibold mb-1">Usuários para teste:</p>
        <p>Vendedor: <code className="bg-gray-100 px-1 rounded">vendedor</code> / <code className="bg-gray-100 px-1 rounded">senha123</code></p>
        <p>Expedição: <code className="bg-gray-100 px-1 rounded">expedicao</code> / <code className="bg-gray-100 px-1 rounded">senha123</code></p>
        <p>Admin: <code className="bg-gray-100 px-1 rounded">admin</code> / <code className="bg-gray-100 px-1 rounded">admin123</code></p>
      </div>
    </div>
  );
};

export default Login;

