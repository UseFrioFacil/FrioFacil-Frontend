// 1. Instale antes os pacotes no frontend:
// npm install @stripe/react-stripe-js @stripe/stripe-js
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, ChevronLeft } from 'lucide-react';
import './Payment.css';

const stripePromise = loadStripe('pk_test_51RhvjHH8Ck0x1QJ5q9TrGsCU79a5K1UkL8B1LW0g3LMAPIEoLZAecuIkEIKkWR8CvSb1cGb5jujOR4Op0cs3vXAS00ri8g6ZNR'); // <-- Substituir pela sua PUBLIC KEY

// --- Componente de Checkout Integrado com Stripe ---
const CheckoutPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'card' | 'wallet'>('card');
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);


  const plan = {
    name: 'profissional',
    price: '49,99',
    features: [
      'Clientes ilimitados',
      'Lembretes automáticos',
      'Suporte via WhatsApp',
      'Dashboard com métricas',
      'Orçamentos online',
    ],
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plano: plan.name }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const OrderSummary = () => (
    <aside className="order-summary">
      <div className="summary-header">
        <button className="back-button" aria-label="Voltar">
          <ChevronLeft size={20} />
        </button>
        <h2 className="summary-title">Resumo do Pedido</h2>
      </div>
      <div className="plan-details">
        <span className="plan-name-badge">{plan.name}</span>
        <div>
          <span className="plan-price">R$ {plan.price}</span>
          <span className="plan-price-period">/mês</span>
        </div>
        <ul className="plan-features">
          {plan.features.map((feature, index) => (
            <li key={index} className="plan-feature">
              <CheckCircle size={16} className="feature-check-icon" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="total-section">
        <div className="total-row">
          <span className="total-label">Total</span>
          <span className="total-amount">R$ {plan.price}</span>
        </div>
      </div>
    </aside>
  );

  const StripeCardForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements || !clientSecret) return;

      setLoading(true);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      setLoading(false);

      if (result.error) {
        alert(`Erro: ${result.error.message}`);
      } else if (result.paymentIntent?.status === 'succeeded') {
        alert('Pagamento aprovado! 🔥');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="card-form">
        <div className="form-group">
          <label className="form-label">Cartão de crédito</label>
          <CardElement className="form-input stripe-input" />
        </div>
        <button type="submit" className="submit-button" disabled={!stripe || loading}>
          {loading ? 'Processando...' : `Pagar R$ ${plan.price}`}
        </button>
      </form>
    );
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="checkout-container">
        <div className="checkout-layout">
          <OrderSummary />

          <main className="payment-column">
            <h2 className="payment-header">Pagamento</h2>
            <div className="payment-tabs">
              <button
                className={`tab-button ${activeTab === 'card' ? 'active' : ''}`}
                onClick={() => setActiveTab('card')}
              >
                <CreditCard size={18} /> Cartão
              </button>
            </div>

            {activeTab === 'card' && clientSecret && <StripeCardForm />}

            <div className="security-badge">
              <Lock size={14} />
              <span>Pagamento seguro e criptografado</span>
            </div>
          </main>
        </div>
      </div>
    </Elements>
  );
};

export default function App() {
  const AppHeader = () => (
    <header style={{ padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', textAlign: 'center', fontWeight: 'bold', color: '#111827' }}>
      FrioFácil
    </header>
  );

  const AppFooter = () => (
    <footer style={{ padding: '20px', backgroundColor: '#111827', color: 'white', textAlign: 'center', fontSize: '14px' }}>
      © 2024 FrioFácil. Todos os direitos reservados.
    </footer>
  );

  return (
    <div>
      <AppHeader />
      <CheckoutPage />
      <AppFooter />
    </div>
  );
}
