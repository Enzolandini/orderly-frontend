import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Configuração do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Redirecionar para login em caso de erro 401 (não autorizado)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviço de autenticação
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      // Armazenar token e dados do usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      localStorage.removeItem('user');
      return null;
    }
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Serviço de pedidos
export const pedidoService = {
  // Métodos para vendedor
  getPedidosVendedor: async () => {
    try {
      const response = await api.get('/pedidos/vendedor');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos do vendedor:', error);
      throw error;
    }
  },
  
  criarPedido: async (formData) => {
    try {
      const response = await api.post('/pedidos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },
  
  // Métodos para expedição
  getPedidosExpedicao: async () => {
    try {
      const response = await api.get('/pedidos/expedicao');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos da expedição:', error);
      throw error;
    }
  },
  
  aprovarHorario: async (id) => {
    try {
      const response = await api.post(`/pedidos/${id}/aprovar`);
      return response.data;
    } catch (error) {
      console.error('Erro ao aprovar horário:', error);
      throw error;
    }
  },
  
  reagendarPedido: async (id, dados) => {
    try {
      const response = await api.post(`/pedidos/${id}/reagendar`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao reagendar pedido:', error);
      throw error;
    }
  },
  
  // Métodos comuns
  getPedidoById: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      throw error;
    }
  },
  
  downloadPdf: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      throw error;
    }
  }
};

export default api;
