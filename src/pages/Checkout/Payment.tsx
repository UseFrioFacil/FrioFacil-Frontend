import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, CreditCard, Smartphone } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RjWIRHKR0vqiVIlUdWni0r20rOdgsAQ0fGlUCuxxlVWjeAXG7A2pgn5oHaHbneWB8lmwmX0LoC2ZUrJuJH3JXa800Lh5oadUh');

// Configuração dos planos
const plans = [
  {
    id: 'basico',
    name: 'Básico',
    price: 29.99,
    features: [
      'Até 50 clientes',
      'Lembretes básicos',
      'Suporte por e-mail',
      'Dashboard simples'
    ]
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: 49.99,
    features: [
      'Clientes ilimitados',
      'Lembretes automáticos',
      'Suporte via WhatsApp',
      'Dashboard completo',
      'Orçamentos online',
      'Relatórios avançados'
    ]
  }
];

// Configuração dos métodos de pagamento
const paymentMethods = [
  {
    id: 'card',
    name: 'Cartão de Crédito',
    icon: <CreditCard size={20} />,
    description: 'Visa, Mastercard, Elo e outros'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    icon: <Smartphone size={20} />,
    description: 'Pagamento rápido e seguro'
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    icon: <Smartphone size={20} />,
    description: 'Pagamento instantâneo'
  }
];

const CheckoutForm = ({ selectedPlan }: { selectedPlan: typeof plans[0] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [walletAvailable, setWalletAvailable] = useState({
    applePay: false,
    googlePay: false
  });

  // Verificar disponibilidade das carteiras digitais
  useEffect(() => {
    const checkWalletAvailability = async () => {
      try {
        // Verificar Apple Pay
        const applePayResponse = await fetch('http://localhost:25565/api/apple-pay-status');
        const applePayData = await applePayResponse.json();
        
        // Verificar Google Pay
        const googlePayResponse = await fetch('http://localhost:25565/api/google-pay-status');
        const googlePayData = await googlePayResponse.json();

        setWalletAvailable({
          applePay: applePayData.available,
          googlePay: googlePayData.available
        });
      } catch (error) {
        console.log('Erro ao verificar carteiras digitais:', error);
      }
    };

    checkWalletAvailability();
  }, []);

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Criar PaymentIntent
      const response = await fetch('http://localhost:25565/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.price,
          planName: selectedPlan.name,
          paymentMethod: selectedMethod
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento');
      }

      const { clientSecret } = await response.json();

      // Processar pagamento baseado no método selecionado
      if (selectedMethod === 'card') {
        // Pagamento com cartão tradicional
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (result.error) {
          throw new Error(result.error.message || 'Erro no pagamento');
        }

        if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          setSuccess(true);
        }
      } else if (selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') {
        // Pagamento com carteira digital
        const result = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
            payment_method_data: {
              billing_details: {
                name: 'Cliente FrioFácil',
                email: 'cliente@friofacil.com'
              }
            }
          }
        });

        if (result.error) {
          throw new Error(result.error.message || 'Erro no pagamento');
        }

        // Verificar se o pagamento foi bem-sucedido
        if ('paymentIntent' in result && result.paymentIntent && (result.paymentIntent as any).status === 'succeeded') {
          setSuccess(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
      console.error('Erro:', err);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="success-message">
        <CheckCircle size={48} className="success-icon" />
        <h3>Pagamento realizado com sucesso!</h3>
        <p>Plano {selectedPlan.name} ativado. Você receberá um e-mail de confirmação.</p>
      </div>
    );
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="plan-info">
        <h3>Plano {selectedPlan.name}</h3>
        <p className="price">R$ {selectedPlan.price.toFixed(2)}/mês</p>
      </div>

      {/* Seleção do método de pagamento */}
      <div className="payment-methods">
        <h3>Escolha a forma de pagamento</h3>
        <div className="methods-grid">
          {paymentMethods.map((method) => {
            // Verificar se a carteira digital está disponível
            const isAvailable = method.id === 'card' || 
              (method.id === 'apple_pay' && walletAvailable.applePay) ||
              (method.id === 'google_pay' && walletAvailable.googlePay);

            return (
              <button
                key={method.id}
                type="button"
                className={`method-option ${selectedMethod === method.id ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                onClick={() => isAvailable && handlePaymentMethodChange(method.id)}
                disabled={!isAvailable}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <span className="method-name">{method.name}</span>
                  <span className="method-description">
                    {!isAvailable && method.id !== 'card' 
                      ? 'Não disponível' 
                      : method.description
                    }
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário de cartão (apenas para cartão) */}
      {selectedMethod === 'card' && (
        <div className="card-form">
          <h3>Dados do cartão</h3>
          <CardElement 
            options={{ 
              style: { 
                base: { 
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              } 
            }} 
          />
        </div>
      )}

      {/* Informações para carteiras digitais */}
      {(selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') && (
        <div className="wallet-info">
          <Smartphone size={24} />
          <p>
            {selectedMethod === 'apple_pay' 
              ? 'Toque no botão Apple Pay para pagar com Face ID, Touch ID ou código de acesso.'
              : 'Toque no botão Google Pay para pagar com seu dispositivo Android.'
            }
          </p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      <button 
        className="submit-button" 
        disabled={!stripe || loading}
        type="submit"
      >
        {loading ? 'Processando...' : `Pagar R$ ${selectedPlan.price.toFixed(2)}`}
      </button>

      <div className="security-badge">
        <Lock size={14} />
        <span>Pagamento seguro e criptografado</span>
      </div>
    </form>
  );
};

const PlanSelector = ({ onSelectPlan }: { onSelectPlan: (plan: typeof plans[0]) => void }) => {
  return (
    <div className="plans-container">
      <h2>Escolha seu plano</h2>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card" onClick={() => onSelectPlan(plan)}>
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="price">R$ {plan.price.toFixed(2)}</span>
              <span className="period">/mês</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <CheckCircle size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="select-plan-btn">
              Escolher {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  if (!selectedPlan) {
    return (
      <>
        <style>{`
          body {
            background-color: #f0f9ff;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
          }

          .plans-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .plans-container h2 {
            text-align: center;
            font-size: 32px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 40px;
          }

          .plans-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
          }

          .plan-card {
            background: white;
            border-radius: 16px;
            padding: 32px;
            border: 2px solid #e5e7eb;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
          }

          .plan-card:hover {
            border-color: #3b82f6;
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
          }

          .plan-card h3 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
          }

          .plan-price {
            margin-bottom: 24px;
          }

          .plan-price .price {
            font-size: 36px;
            font-weight: 800;
            color: #3b82f6;
          }

          .plan-price .period {
            font-size: 16px;
            color: #6b7280;
            margin-left: 4px;
          }

          .plan-features {
            list-style: none;
            padding: 0;
            margin-bottom: 32px;
            text-align: left;
          }

          .plan-features li {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            color: #4b5563;
          }

          .plan-features svg {
            color: #3b82f6;
            flex-shrink: 0;
          }

          .select-plan-btn {
            width: 100%;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .select-plan-btn:hover {
            background: #2563eb;
          }

          @media (max-width: 768px) {
            .plans-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
        <PlanSelector onSelectPlan={setSelectedPlan} />
      </>
    );
  }

  return (
    <>
      <style>{`
        body {
          background-color: #f0f9ff;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 20px;
        }

        .checkout-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .payment-form {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .plan-info {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .plan-info h3 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .plan-info .price {
          font-size: 32px;
          font-weight: 800;
          color: #3b82f6;
        }

        .payment-methods {
          margin-bottom: 24px;
        }

        .payment-methods h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .method-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: #f9fafb;
          text-align: left;
        }

        .method-option:hover:not(.disabled) {
          background-color: #f3f4f6;
          border-color: #d1d5db;
        }

        .method-option.selected {
          border-color: #3b82f6;
          background-color: #e0f2fe;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }

        .method-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .method-icon {
          color: #3b82f6;
          flex-shrink: 0;
        }

        .method-info {
          display: flex;
          flex-direction: column;
        }

        .method-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .method-description {
          font-size: 12px;
          color: #6b7280;
        }

        .card-form {
          margin-bottom: 24px;
        }

        .card-form h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .card-form .StripeElement {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 16px;
          background: #f9fafb;
        }

        .wallet-info {
          background: #f0f9ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #3b82f6;
        }

        .wallet-info p {
          font-size: 14px;
          color: #4b5563;
          margin: 0;
        }

        .submit-button {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .submit-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .error-message {
          background: #fef3f2;
          border: 1px solid #fda49a;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          color: #991b1b;
        }

        .success-message {
          text-align: center;
          padding: 40px;
          background: #e0f7fa;
          border-radius: 16px;
          border: 1px solid #b2ebf2;
        }

        .success-message h3 {
          color: #00796b;
          margin-bottom: 16px;
        }

        .success-icon {
          color: #00c853;
          margin-bottom: 16px;
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .back-button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-button:hover {
          text-decoration: underline;
        }
      `}</style>
      
      <div className="checkout-container">
        <button className="back-button" onClick={() => setSelectedPlan(null)}>
          ← Voltar para planos
        </button>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm selectedPlan={selectedPlan} />
        </Elements>
      </div>
    </>
  );
}
