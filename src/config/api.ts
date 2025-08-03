// Configuração da API
const API_CONFIG = {
  // URL base da API do backend
  BASE_URL: 'https://backend.usefriofacil.com.br',
  
  // Endpoints da API
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/friofacil/login',
    REGISTER: '/api/friofacil/register',
    MY_ACCOUNT: '/api/friofacil/myaccount',
    USER_DELETE: '/api/friofacil/userdelete',
    
    // Company endpoints
    CREATE_TEMP_COMPANY: '/api/friofacil/createtempcompany',
    COMPANY_DELETE: '/api/friofacil/companydelete',
    
    // Home endpoint
    HOME: '/api/friofacil/home',
    
    // Invite endpoints
    RESPOND_INVITE: '/api/friofacil/respondinvite',
    
    // Health check
    HEALTH: '/api/friofacil/health'
  }
};

// Helper function para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export das configurações
export default API_CONFIG;

// URLs específicas para fácil importação
export const API_URLS = {
  LOGIN: getApiUrl(API_CONFIG.ENDPOINTS.LOGIN),
  REGISTER: getApiUrl(API_CONFIG.ENDPOINTS.REGISTER),
  MY_ACCOUNT: getApiUrl(API_CONFIG.ENDPOINTS.MY_ACCOUNT),
  USER_DELETE: getApiUrl(API_CONFIG.ENDPOINTS.USER_DELETE),
  CREATE_TEMP_COMPANY: getApiUrl(API_CONFIG.ENDPOINTS.CREATE_TEMP_COMPANY),
  COMPANY_DELETE: getApiUrl(API_CONFIG.ENDPOINTS.COMPANY_DELETE),
  HOME: getApiUrl(API_CONFIG.ENDPOINTS.HOME),
  RESPOND_INVITE: getApiUrl(API_CONFIG.ENDPOINTS.RESPOND_INVITE),
  HEALTH: getApiUrl(API_CONFIG.ENDPOINTS.HEALTH)
};