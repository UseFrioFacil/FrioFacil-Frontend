// Configuração da API
const API_CONFIG = {
  // URL base da API do backend
  BASE_URL: 'https://backend.usefriofacil.com.br',
  
  // URL base da API de pagamento
  PAYMENT_BASE_URL: import.meta.env.DEV ? 'http://localhost:3001' : 'https://payment.usefriofacil.com.br',
  
  // Endpoints da API do backend
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
  },
  
  // Endpoints da API de pagamento
  PAYMENT_ENDPOINTS: {
    // Subscription endpoints
    CREATE_SUBSCRIPTION: '/api/create-subscription',
    CANCEL_SUBSCRIPTION: '/api/cancel-subscription',
    GET_SUBSCRIPTIONS: '/api/subscriptions/me',
    
    // Health check
    HEALTH: '/health',
    
    // Apple/Google Pay
    APPLE_PAY_STATUS: '/api/apple-pay-status',
    GOOGLE_PAY_STATUS: '/api/google-pay-status',
    
    // Setup
    SETUP_PRODUCTS: '/api/setup-products'
  }
};

// Helper functions para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getPaymentApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.PAYMENT_BASE_URL}${endpoint}`;
};

// Export das configurações
export default API_CONFIG;

// URLs específicas do backend para fácil importação
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

// URLs específicas da API de pagamento para fácil importação
export const PAYMENT_API_URLS = {
  CREATE_SUBSCRIPTION: getPaymentApiUrl(API_CONFIG.PAYMENT_ENDPOINTS.CREATE_SUBSCRIPTION),
  CANCEL_SUBSCRIPTION: getPaymentApiUrl(API_CONFIG.PAYMENT_ENDPOINTS.CANCEL_SUBSCRIPTION),
  GET_SUBSCRIPTIONS: getPaymentApiUrl(API_CONFIG.PAYMENT_ENDPOINTS.GET_SUBSCRIPTIONS),
  HEALTH: getPaymentApiUrl(API_CONFIG.PAYMENT_ENDPOINTS.HEALTH),
  APPLE_PAY_STATUS: getPaymentApiUrl(API_CONFIG.PAYMENT_ENDPOINTS.APPLE_PAY_STATUS),
  GOOGLE_PAY_STATUS: getPaymentApiUrl(API_CONFIG.PAYMENT_ENDPOINTS.GOOGLE_PAY_STATUS),
  SETUP_PRODUCTS: getPaymentApiUrl(API_CONFIG.PAYMENT_ENDPOINTS.SETUP_PRODUCTS)
};