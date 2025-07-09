import React, { useState } from 'react';
import { Lock, CheckCircle, ChevronLeft } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RhvjHH8Ck0x1QJ5q9TrGsCU79a5K1UkL8B1LW0g3LMAPIEoLZAecuIkEIKkWR8CvSb1cGb5jujOR4Op0cs3vXAS00ri8g6ZNR'); // <-- sua chave pública do Stripe

const CheckoutForm = ({ price }: { price: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const res = await fetch('https://payment.usefriofacil.com.br/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(price * 100) }),
      });

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        alert('Pagamento realizado com sucesso!');
      }
    } catch (err) {
      alert('Erro ao processar pagamento');
    }

    setLoading(false);
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button className="submit-button" disabled={!stripe || loading}>
        {loading ? 'Processando...' : `Pagar R$ ${price}`}
      </button>
    </form>
  );
};

const OrderSummary = () => {
  const plan = {
    name: "Profissional",
    price: "49.99",
    features: [
      "Clientes ilimitados",
      "Lembretes automáticos",
      "Suporte via WhatsApp",
      "Dashboard com métricas",
      "Orçamentos online",
    ]
  };

  return (
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
};

export default function App() {
  const planPrice = 49.99;

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  body {
    background-color: #f0f9ff;
    font-family: 'Inter', sans-serif;
    color: #374151;
  }

  .checkout-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 40px 20px;
    gap: 40px;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .checkout-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    width: 100%;
    max-width: 1000px;
  }

  @media (min-width: 1024px) {
    .checkout-layout {
      grid-template-columns: 4fr 5fr;
    }
  }

  .order-summary {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    height: fit-content;
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .back-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 4px;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .back-button:hover {
    background-color: #f3f4f6;
  }

  .summary-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
  }

  .plan-details {
    background-color: #f0f9ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .plan-name-badge {
    display: inline-block;
    background-color: #3b82f6;
    color: white;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  .plan-price {
    font-size: 28px;
    font-weight: 800;
    color: #111827;
  }

  .plan-price-period {
    font-size: 16px;
    font-weight: 500;
    color: #6b7280;
    margin-left: 4px;
  }

  .plan-features {
    list-style: none;
    padding: 0;
    margin-top: 16px;
  }

  .plan-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #4b5563;
  }

  .feature-check-icon {
    color: #3b82f6;
    flex-shrink: 0;
  }

  .total-section {
    padding-top: 24px;
    border-top: 1px solid #f3f4f6;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }

  .total-label {
    font-weight: 600;
    color: #111827;
  }

  .total-amount {
    font-weight: 700;
    font-size: 20px;
    color: #111827;
  }

  .payment-column {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  }

  .payment-header {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 24px;
  }

  .submit-button {
    width: 100%;
    background-color: #3b82f6;
    color: white;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
  }

  .submit-button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
  }

  .security-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    font-size: 12px;
    color: #6b7280;
  }

  .card-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid #d1d5db;
    padding: 20px;
    border-radius: 8px;
  }

  @media (max-width: 1023px) {
    .checkout-container {
      padding: 20px 15px;
      flex-direction: column;
      align-items: center;
    }

    .order-summary {
      order: 1;
    }

    .payment-column {
      order: 2;
    }
  }

  @media (max-width: 480px) {
    .order-summary,
    .payment-column {
      padding: 24px;
    }

    .summary-title,
    .payment-header {
      font-size: 18px;
    }
  }
`}</style>
      <header style={{ padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', textAlign: 'center', fontWeight: 'bold', color: '#111827' }}>
        FrioFácil
      </header>

      <div className="checkout-container">
        <div className="checkout-layout">
          <OrderSummary />
          <main className="payment-column">
            <h2 className="payment-header">Pagamento</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm price={planPrice} />
            </Elements>
            <div className="security-badge">
              <Lock size={14} />
              <span>Pagamento seguro e criptografado</span>
            </div>
          </main>
        </div>
      </div>

      <footer style={{ padding: '20px', backgroundColor: '#111827', color: 'white', textAlign: 'center', fontSize: '14px' }}>
        © 2024 FrioFácil. Todos os direitos reservados.
      </footer>
    </>
  );
}
