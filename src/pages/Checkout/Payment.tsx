import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './Payment.css'
import CheckoutForm from './uiCheckout/CheckoutForm';
import PlanSelector from './uiCheckout/PlanSelector'
import Header from '../../components/Header/Header';

const stripePromise = loadStripe('pk_test_51RjWIRHKR0vqiVIlUdWni0r20rOdgsAQ0fGlUCuxxlVWjeAXG7A2pgn5oHaHbneWB8lmwmX0LoC2ZUrJuJH3JXa800Lh5oadUh');

// Configuração dos planos com IDs do Stripe
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
    ],
    priceId: 'price_1RjwXwHKR0vqiVIlCoD6A0a5' // Será substituído pelo ID real do Stripe
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
    ],
    priceId: 'price_1RjwXwHKR0vqiVIloWVpqnzZ' // Será substituído pelo ID real do Stripe
  }
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  
  // Pegar CompanyTempId e JWT da URL se existir
  const urlParams = new URLSearchParams(window.location.search);
  const companyTempId = urlParams.get('companyTempId');
  const jwtToken = urlParams.get('jwt');

  if (!selectedPlan) {
    return (
      <>
        <PlanSelector onSelectPlan={setSelectedPlan} companyTempId={companyTempId} />
      </>
    );
  }

  return (
    <>
      <Header showMenu={false} showOptions={false}/>

      <div className="checkout-container">
        <button className="back-button" onClick={() => setSelectedPlan(null)}>
          ← Voltar para planos
        </button>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm selectedPlan={selectedPlan} jwtToken={jwtToken || undefined} />
        </Elements>
      </div>
    </>
  );
}

export {plans}
