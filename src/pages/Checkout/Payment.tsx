import React, { useState } from 'react';
import { Lock, CheckCircle, Calendar, Shield, MapPin, User, CreditCard } from 'lucide-react';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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

// Função para validar CPF
const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Função para formatar CPF
const formatCPF = (value: string) => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para formatar telefone
const formatPhone = (value: string) => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length <= 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
};

// Função para formatar CEP
const formatCEP = (value: string) => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
};

const CheckoutForm = ({ selectedPlan, jwtToken }: { selectedPlan: typeof plans[0], jwtToken?: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Dados do cliente
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCPF, setCustomerCPF] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Validações
    if (!customerEmail.trim()) {
      setError('Por favor, informe seu e-mail');
      return;
    }

    if (!customerName.trim()) {
      setError('Por favor, informe seu nome completo');
      return;
    }

    if (!customerCPF.trim()) {
      setError('Por favor, informe seu CPF');
      return;
    }

    if (!validateCPF(customerCPF)) {
      setError('CPF inválido. Por favor, verifique os números informados.');
      return;
    }

    if (!customerPhone.trim()) {
      setError('Por favor, informe seu telefone');
      return;
    }

    if (!customerAddress.street.trim() || !customerAddress.number.trim() || 
        !customerAddress.city.trim() || !customerAddress.state.trim() || 
        !customerAddress.zipCode.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios do endereço');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Criar PaymentMethod do cartão
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);
      
      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        throw new Error('Dados do cartão não preenchidos');
      }

      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: {
            line1: `${customerAddress.street}, ${customerAddress.number}`,
            line2: customerAddress.complement,
            city: customerAddress.city,
            state: customerAddress.state,
            postal_code: customerAddress.zipCode.replace(/\D/g, ''),
            country: 'BR'
          }
        }
      });
      if (pmError || !paymentMethod) {
        throw new Error(pmError?.message || 'Erro ao criar método de pagamento');
      }

      // 2. Enviar dados para o backend
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      // Adicionar JWT no header se disponível
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      const response = await fetch('http://localhost:25565/api/create-subscription', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          priceId: selectedPlan.priceId,
          customerEmail: customerEmail.trim(),
          customerName: customerName.trim(),
          customerCPF: customerCPF.replace(/\D/g, ''),
          customerPhone: customerPhone.replace(/\D/g, ''),
          customerAddress: customerAddress,
          paymentMethodId: paymentMethod.id,
          // companyTempId será extraído do JWT pela API
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar assinatura');
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error('Erro ao processar assinatura');
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
        <h3>Assinatura ativada com sucesso!</h3>
        <p>Plano {selectedPlan.name} ativado. Você receberá um e-mail de confirmação.</p>
        
        <div className="subscription-info">
          <Calendar size={16} />
          <span>Próxima cobrança: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</span>
        </div>

        <div className="payment-info">
          <CreditCard size={16} />
          <div>
            <p><strong>Pagamento automático configurado</strong></p>
            <p>Seu cartão será cobrado automaticamente a cada mês para renovar a assinatura.</p>
            <p>Você pode alterar ou cancelar a qualquer momento no seu painel.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="plan-info">
        <h3>Plano {selectedPlan.name}</h3>
        <p className="price">R$ {selectedPlan.price.toFixed(2)}/mês</p>
        <p className="recurring-info">
          <Calendar size={16} />
          Assinatura recorrente mensal
        </p>
      </div>

      {/* Formulário de dados do cliente */}
      <div className="customer-form">
        <div className="form-header">
          <User size={20} />
          <h3>Seus dados pessoais</h3>
        </div>
        
        <div className="security-notice">
          <Shield size={16} />
          <p>Seus dados são coletados para segurança e conformidade legal. Todas as informações são criptografadas e protegidas.</p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerName">Nome completo *</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Seu nome completo"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="customerEmail">E-mail *</label>
            <input
              type="email"
              id="customerEmail"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="seu@email.com"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerCPF">CPF *</label>
            <input
              type="text"
              id="customerCPF"
              value={customerCPF}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value);
                setCustomerCPF(formatted);
              }}
              placeholder="000.000.000-00"
              className="form-input"
              maxLength={14}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="customerPhone">Telefone *</label>
            <input
              type="text"
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setCustomerPhone(formatted);
              }}
              placeholder="(11) 99999-9999"
              className="form-input"
              maxLength={15}
              required
            />
          </div>
        </div>
      </div>

      {/* Formulário de endereço */}
      <div className="address-form">
        <div className="form-header">
          <MapPin size={20} />
          <h3>Endereço para cobrança</h3>
        </div>
        
        <div className="security-notice">
          <Shield size={16} />
          <p>Endereço necessário para validação de segurança e emissão de documentos fiscais.</p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="street">Rua/Avenida *</label>
            <input
              type="text"
              id="street"
              value={customerAddress.street}
              onChange={(e) => setCustomerAddress({...customerAddress, street: e.target.value})}
              placeholder="Rua das Flores"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="number">Número *</label>
            <input
              type="text"
              id="number"
              value={customerAddress.number}
              onChange={(e) => setCustomerAddress({...customerAddress, number: e.target.value})}
              placeholder="123"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="complement">Complemento</label>
            <input
              type="text"
              id="complement"
              value={customerAddress.complement}
              onChange={(e) => setCustomerAddress({...customerAddress, complement: e.target.value})}
              placeholder="Apto 45, Bloco B"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="neighborhood">Bairro</label>
            <input
              type="text"
              id="neighborhood"
              value={customerAddress.neighborhood}
              onChange={(e) => setCustomerAddress({...customerAddress, neighborhood: e.target.value})}
              placeholder="Centro"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Cidade *</label>
            <input
              type="text"
              id="city"
              value={customerAddress.city}
              onChange={(e) => setCustomerAddress({...customerAddress, city: e.target.value})}
              placeholder="São Paulo"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">Estado *</label>
            <select
              id="state"
              value={customerAddress.state}
              onChange={(e) => setCustomerAddress({...customerAddress, state: e.target.value})}
              className="form-input"
              required
            >
              <option value="">Selecione...</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">CEP *</label>
          <input
            type="text"
            id="zipCode"
            value={customerAddress.zipCode}
            onChange={(e) => {
              const formatted = formatCEP(e.target.value);
              setCustomerAddress({...customerAddress, zipCode: formatted});
            }}
            placeholder="00000-000"
            className="form-input"
            maxLength={9}
            required
          />
        </div>
      </div>

      {/* Formulário de cartão */}
      <div className="card-form">
        <div className="form-header">
          <CreditCard size={20} />
          <h3>Dados do cartão</h3>
        </div>
        
        <div className="security-notice">
          <Shield size={16} />
          <p>Seus dados de pagamento são processados de forma segura pelo Stripe.</p>
        </div>

        <div className="card-elements">
          <div className="form-group">
            <label>Número do cartão *</label>
            <div className="stripe-element-container">
              <CardNumberElement 
                options={{ 
                  style: { 
                    base: { 
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': { color: '#aab7c4' },
                    },
                    invalid: { color: '#9e2146' },
                  },
                  placeholder: '1234 1234 1234 1234'
                }} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data de validade *</label>
              <div className="stripe-element-container">
                <CardExpiryElement 
                  options={{ 
                    style: { 
                      base: { 
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': { color: '#aab7c4' },
                      },
                      invalid: { color: '#9e2146' },
                    },
                    placeholder: 'MM/AA'
                  }} 
                />
              </div>
            </div>
            <div className="form-group">
              <label>CVC *</label>
              <div className="stripe-element-container">
                <CardCvcElement 
                  options={{ 
                    style: { 
                      base: { 
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': { color: '#aab7c4' },
                      },
                      invalid: { color: '#9e2146' },
                    },
                    placeholder: '123'
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cardZipCode">CEP do cartão *</label>
            <input
              type="text"
              id="cardZipCode"
              value={customerAddress.zipCode}
              readOnly
              className="form-input readonly"
              placeholder="CEP preenchido automaticamente"
            />
            <small className="form-help">CEP preenchido automaticamente com base no endereço informado</small>
          </div>
        </div>
      </div>

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
        {loading ? 'Processando...' : `Assinar Plano ${selectedPlan.name} - R$ ${selectedPlan.price.toFixed(2)}/mês`}
      </button>

      <div className="security-badge">
        <Lock size={14} />
        <span>Pagamento seguro e criptografado</span>
      </div>

      <div className="subscription-terms">
        <p>
          Ao assinar, você concorda com os termos de serviço. A assinatura será renovada automaticamente 
          a cada mês até ser cancelada. Você pode cancelar a qualquer momento.
        </p>
      </div>
    </form>
  );
};

const PlanSelector = ({ onSelectPlan, companyTempId }: { onSelectPlan: (plan: typeof plans[0]) => void, companyTempId?: string | null }) => {
  return (
    <div className="plans-container">
      <h2>Escolha seu plano</h2>
      <p className="plans-subtitle">Assinatura mensal - cancele quando quiser</p>
      
      {companyTempId && (
        <div className="company-notice">
          <p>Você está criando uma empresa. Após o pagamento, sua empresa será ativada automaticamente.</p>
        </div>
      )}
      
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
              Assinar {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  
  // Pegar CompanyTempId e JWT da URL se existir
  const urlParams = new URLSearchParams(window.location.search);
  const companyTempId = urlParams.get('companyTempId');
  const jwtToken = urlParams.get('jwt');

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
            margin-bottom: 8px;
          }

          .plans-subtitle {
            text-align: center;
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 40px;
          }

          ${companyTempId ? `
          .company-notice {
            background: #f0f9ff;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            text-align: center;
            color: #3b82f6;
          }
          ` : ''}

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
        <PlanSelector onSelectPlan={setSelectedPlan} companyTempId={companyTempId} />
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
          margin-bottom: 8px;
        }

        .recurring-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .customer-form,
        .address-form {
          margin-bottom: 32px;
          padding: 24px;
          background-color: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .form-header svg {
          color: #3b82f6;
        }

        .security-notice {
          background: #f0f9ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .security-notice svg {
          color: #3b82f6;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .security-notice p {
          margin: 0;
          font-size: 13px;
          color: #4b5563;
          line-height: 1.4;
        }

        .card-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .card-elements {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stripe-element-container {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 12px 16px;
          background: #f9fafb;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .stripe-element-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .stripe-element-container .StripeElement {
          background: transparent;
        }

        .form-input.readonly {
          background-color: #f3f4f6;
          color: #6b7280;
          cursor: not-allowed;
          border-color: #e5e7eb;
        }

        .form-input.readonly:focus {
          border-color: #e5e7eb;
          box-shadow: none;
        }

        .form-help {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
          display: block;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-row {
          display: flex;
          gap: 16px;
        }

        .form-row .form-group {
          flex: 1;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .form-input:invalid {
          border-color: #ef4444;
        }

        .form-input:invalid:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }

        .form-group label[for*="required"]::after,
        .form-group label:has(+ input[required])::after {
          content: " *";
          color: #ef4444;
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

        .submit-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .error-message {
          background: #fef3f2;
          border: 1px solid #fda49a;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          color: #991b1b;
          font-size: 14px;
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

        .subscription-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px;
          background: #f0f9ff;
          border-radius: 8px;
          color: #3b82f6;
          font-size: 14px;
        }

        .payment-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 24px;
          padding: 16px;
          background: #f0f9ff;
          border-radius: 12px;
          border: 1px solid #bfdbfe;
          color: #3b82f6;
        }

        .payment-info svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .payment-info div {
          flex: 1;
        }

        .payment-info p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.4;
        }

        .payment-info p:last-child {
          margin-bottom: 0;
        }

        .payment-info strong {
          color: #111827;
          font-weight: 600;
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
        
        .security-badge svg {
            color: #10b981;
        }

        .subscription-terms {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
          margin-top: 16px;
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

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
      
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
