// Configurações de pagamento do FrioFácil
export const PAYMENT_CONFIG = {
  // URL da API de pagamentos
  API_BASE_URL: (window as any).ENV?.REACT_APP_API_URL || 'http://localhost:25565',
  
  // Chave da API (opcional para autenticação)
  API_KEY: (window as any).ENV?.REACT_APP_API_KEY || '',
  
  // Chave pública do Stripe
  STRIPE_PUBLIC_KEY: 'pk_test_51RjWIRHKR0vqiVIlUdWni0r20rOdgsAQ0fGlUCuxxlVWjeAXG7A2pgn5oHaHbneWB8lmwmX0LoC2ZUrJuJH3JXa800Lh5oadUh',
  
  // Endpoints da API
  ENDPOINTS: {
    CREATE_PAYMENT_INTENT: '/api/payments/create-payment-intent',
    CONFIRM_PAYMENT: '/api/payments/confirm-payment',
    PAYMENT_STATUS: '/api/payments/payment-status',
    CANCEL_PAYMENT: '/api/payments/cancel-payment',
  },
  
  // Configurações de moeda
  CURRENCY: 'brl',
  
  // Configurações de métodos de pagamento
  PAYMENT_METHODS: {
    CARD: 'card',
    PIX: 'pix',
    BOLETO: 'boleto',
    WALLET: 'wallet',
  },
  
  // Configurações de timeout
  TIMEOUT: 30000, // 30 segundos
  
  // Configurações de retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Função para fazer requisições à API de pagamentos
export const paymentApi = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${PAYMENT_CONFIG.API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(PAYMENT_CONFIG.API_KEY && {
          'Authorization': `Bearer ${PAYMENT_CONFIG.API_KEY}`
        }),
        ...options.headers,
      },
      // timeout é configurado via AbortController
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  // Criar PaymentIntent
  async createPaymentIntent(data: {
    amount: number;
    paymentMethod: string;
    currency?: string;
  }) {
    return this.request(PAYMENT_CONFIG.ENDPOINTS.CREATE_PAYMENT_INTENT, {
      method: 'POST',
      body: JSON.stringify({
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        currency: data.currency || PAYMENT_CONFIG.CURRENCY,
      }),
    });
  },

  // Confirmar pagamento
  async confirmPayment(data: {
    paymentIntentId: string;
    paymentMethodId?: string;
  }) {
    return this.request(PAYMENT_CONFIG.ENDPOINTS.CONFIRM_PAYMENT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verificar status do pagamento
  async getPaymentStatus(paymentIntentId: string) {
    return this.request(`${PAYMENT_CONFIG.ENDPOINTS.PAYMENT_STATUS}/${paymentIntentId}`, {
      method: 'GET',
    });
  },

  // Cancelar pagamento
  async cancelPayment(paymentIntentId: string) {
    return this.request(PAYMENT_CONFIG.ENDPOINTS.CANCEL_PAYMENT, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  },
};

// Função para formatar valores monetários
export const formatCurrency = (amount: number, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Função para validar dados de pagamento
export const validatePaymentData = (data: any) => {
  const errors: string[] = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Valor deve ser maior que zero');
  }

  if (!data.paymentMethod || !Object.values(PAYMENT_CONFIG.PAYMENT_METHODS).includes(data.paymentMethod)) {
    errors.push('Método de pagamento inválido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Função para retry automático
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = PAYMENT_CONFIG.MAX_RETRIES,
  delay = PAYMENT_CONFIG.RETRY_DELAY
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }

      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError!;
}; 