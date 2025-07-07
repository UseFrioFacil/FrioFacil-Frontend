import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_*************'); // Public key da Stripe

const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Cria PaymentIntent no backend
    fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    });

    if (result.error) {
      alert(`Erro no pagamento: ${result.error.message}`);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Pagamento aprovado! 🔥');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pagar</button>
    </form>
  );
};

const StripeCheckout = ({ amount }: { amount: number }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm amount={amount} />
  </Elements>
);

export default StripeCheckout;
