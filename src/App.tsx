import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Layout from './components/Layout';
import Login from './pages/Login';
import VendedorDashboard from './pages/VendedorDashboard';
import ExpedicaoDashboard from './pages/ExpedicaoDashboard';
import NovoPedido from './pages/NovoPedido';
import DetalhesPedido from './pages/DetalhesPedido';
import ReagendarPedido from './pages/ReagendarPedido';

// Componente para rotas protegidas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirecionar para dashboard apropriado se não tiver permissão
    if (user.role === 'VENDEDOR') {
      return <Navigate to="/vendedor/dashboard" replace />;
    } else if (user.role === 'EXPEDICAO') {
      return <Navigate to="/expedicao/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas para Vendedor */}
        <Route 
          path="/vendedor" 
          element={
            <ProtectedRoute allowedRoles={['VENDEDOR']}>
              <Layout userRole="VENDEDOR" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<VendedorDashboard />} />
          <Route path="novo-pedido" element={<NovoPedido />} />
          <Route path="pedido/:id" element={<DetalhesPedido />} />
        </Route>
        
        {/* Rotas para Expedição */}
        <Route 
          path="/expedicao" 
          element={
            <ProtectedRoute allowedRoles={['EXPEDICAO']}>
              <Layout userRole="EXPEDICAO" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ExpedicaoDashboard />} />
          <Route path="pedido/:id" element={<DetalhesPedido />} />
          <Route path="reagendar/:id" element={<ReagendarPedido />} />
        </Route>
        
        {/* Redirecionamentos */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/vendedor" element={<Navigate to="/vendedor/dashboard" replace />} />
        <Route path="/expedicao" element={<Navigate to="/expedicao/dashboard" replace />} />
        
        {/* Rota para qualquer outro caminho não definido */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
