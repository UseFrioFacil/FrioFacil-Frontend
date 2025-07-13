import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Payment.css';
import CheckoutForm from './uiCheckout/CheckoutForm';
import PlanSelector from './uiCheckout/PlanSelector';
import Header from '../../components/Header/Header';

// Chave pública do Stripe (deve ser guardada em variáveis de ambiente em um projeto real)
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
    ],
    priceId: 'price_1RjwXwHKR0vqiVIlCoD6A0a5' // ID do Preço no Stripe
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
    priceId: 'price_1RjwXwHKR0vqiVIloWVpqnzZ' // ID do Preço no Stripe
  }
];

export default function PaymentPage() {
    const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const tokenTempCompany = location.state?.tokenTempCompany;

    useEffect(() => {
        if (!tokenTempCompany) {
            toast.error("Por favor, cadastre os dados da empresa primeiro.");
            navigate('/cadastrarempresa'); 
        }
    }, [tokenTempCompany, navigate]);

    if (!tokenTempCompany) {
        return null; 
    }

    if (!selectedPlan) {
        return (
            <PlanSelector onSelectPlan={setSelectedPlan} />
        );
    }

    return (
        <>
            <Header showMenu={false} showOptions={false} showBackButton={true}/>

            <div className="checkout-container">
                <button className="back-button" onClick={() => setSelectedPlan(null)}>
                    ← Voltar para planos
                </button>
                
                <Elements stripe={stripePromise}>
                    <CheckoutForm 
                        selectedPlan={selectedPlan} 
                        tokenTempCompany={tokenTempCompany} 
                    />
                </Elements>
            </div>
        </>
    );
}

export { plans };