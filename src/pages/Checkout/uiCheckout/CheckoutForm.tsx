import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Lock, CheckCircle, Calendar, Shield, MapPin, User, CreditCard } from 'lucide-react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { plans } from "../Payment"; // Verifique se o caminho para este import está correto
import axios from 'axios';
import { toast } from 'react-toastify';
import { PAYMENT_API_URLS } from '../../../config/api';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner.tsx';

// --- FUNÇÕES AUXILIARES ---

const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false;
    let sum = 0; let remainder: number;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
    return true;
};

const formatCPF = (value: string): string => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
};

const formatPhone = (value: string): string => {
    let cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 10) {
        return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substring(0, 15);
    } else {
        return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3').substring(0, 14);
    }
};

const formatCEP = (value: string): string => {
    return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
};

// --- INTERFACE DE PROPS ---

interface CheckoutFormProps {
    selectedPlan: typeof plans[0];
    tokenCompany: string | null; // Este é o TOKEN da empresa temporária
}

// --- COMPONENTE PRINCIPAL ---

const CheckoutForm: FC<CheckoutFormProps> = ({ selectedPlan, tokenCompany }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Estados dos formulários
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerCPF, setCustomerCPF] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState({
        street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: ''
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const userToken = localStorage.getItem("accessToken");

        if (!stripe || !elements) {
            toast.error("Serviço de pagamento indisponível.");
            setLoading(false);
            return;
        }
        if (!userToken) {
            toast.error("Usuário não autenticado. Por favor, faça login novamente.");
            setLoading(false);
            return;
        }
        if (!tokenCompany) {
            toast.error("Identificação da empresa não encontrada.");
            setLoading(false);
            return;
        }
        if (!customerName.trim() || !customerEmail.trim() || !validateCPF(customerCPF) || !customerPhone.trim()) {
            toast.error('Por favor, preencha seus dados pessoais corretamente.');
            setLoading(false);
            return;
        }
        const { street, number, city, state, zipCode, neighborhood } = customerAddress;
        if (!street.trim() || !number.trim() || !city.trim() || !state.trim() || !zipCode.trim() || !neighborhood.trim()) {
            toast.error('Preencha o endereço de cobrança completo.');
            setLoading(false);
            return;
        }

        try {
            const cardElement = elements.getElement(CardNumberElement);
            if (!cardElement) {
                throw new Error('Dados do cartão não preenchidos.');
            }

            const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
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

            if (pmError || !paymentMethod?.id) {
                throw new Error(pmError?.message || 'Erro ao validar os dados do cartão.');
            }

            const payload = {
                priceId: selectedPlan.priceId,
                customerEmail: customerEmail.trim(),
                customerName: customerName.trim(),
                customerCPF: customerCPF.replace(/\D/g, ''),
                customerPhone: customerPhone.replace(/\D/g, ''),
                customerAddress: customerAddress,
                paymentMethodId: paymentMethod.id,
                companyToken: tokenCompany, // TOKEN da empresa vai no corpo
            };

            console.log(payload)
            
            const response = await axios.post(
                PAYMENT_API_URLS.CREATE_SUBSCRIPTION,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );

            if (response.data?.success) {
                setSuccess(true);
            } else {
                throw new Error(response.data?.message || 'Erro ao finalizar assinatura.');
            }

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro inesperado.';
            toast.error(errorMessage);
            console.log(errorMessage)
        } finally {
            setLoading(false);
        }
    };
    
    if (success) {
        return (
            <>
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
            </>
        );
    }

    return (
        <>
            <LoadingSpinner isLoading={loading} />
            <form className="payment-form" onSubmit={handleSubmit}>
            <div className="plan-info">
                <h3>Plano {selectedPlan.name}</h3>
                <p className="price">R$ {selectedPlan.price.toFixed(2)}/mês</p>
                <p className="recurring-info"><Calendar size={16} /> Assinatura recorrente mensal</p>
            </div>

            <div className="customer-form">
                <div className="form-header"><User size={20} /><h3>Seus dados pessoais</h3></div>
                <div className="security-notice"><Shield size={16} /><p>Seus dados são coletados para segurança e conformidade legal.</p></div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="customerName">Nome completo *</label>
                        <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Seu nome completo" className="form-input" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerEmail">E-mail *</label>
                        <input type="email" id="customerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="seu@email.com" className="form-input" required/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="customerCPF">CPF *</label>
                        <input type="text" id="customerCPF" value={customerCPF} onChange={(e) => setCustomerCPF(formatCPF(e.target.value))} placeholder="000.000.000-00" className="form-input" maxLength={14} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerPhone">Telefone *</label>
                        <input type="text" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(formatPhone(e.target.value))} placeholder="(11) 99999-9999" className="form-input" maxLength={15} required/>
                    </div>
                </div>
            </div>

            <div className="address-form">
                <div className="form-header"><MapPin size={20} /><h3>Endereço para cobrança</h3></div>
                <div className="security-notice"><Shield size={16} /><p>Endereço necessário para validação e emissão de documentos fiscais.</p></div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="street">Rua/Avenida *</label>
                        <input type="text" id="street" value={customerAddress.street} onChange={(e) => setCustomerAddress({...customerAddress, street: e.target.value})} placeholder="Rua das Flores" className="form-input" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="number">Número *</label>
                        <input type="text" id="number" value={customerAddress.number} onChange={(e) => setCustomerAddress({...customerAddress, number: e.target.value})} placeholder="123" className="form-input" required/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="complement">Complemento</label>
                        <input type="text" id="complement" value={customerAddress.complement} onChange={(e) => setCustomerAddress({...customerAddress, complement: e.target.value})} placeholder="Apto 45, Bloco B" className="form-input"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="neighborhood">Bairro *</label>
                        <input type="text" id="neighborhood" value={customerAddress.neighborhood} onChange={(e) => setCustomerAddress({...customerAddress, neighborhood: e.target.value})} placeholder="Centro" className="form-input" required/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city">Cidade *</label>
                        <input type="text" id="city" value={customerAddress.city} onChange={(e) => setCustomerAddress({...customerAddress, city: e.target.value})} placeholder="São Paulo" className="form-input" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">Estado *</label>
                        <select id="state" value={customerAddress.state} onChange={(e) => setCustomerAddress({...customerAddress, state: e.target.value})} className="form-input" required>
                            <option value="">Selecione...</option>
                            <option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapá</option><option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceará</option><option value="DF">Distrito Federal</option><option value="ES">Espírito Santo</option><option value="GO">Goiás</option><option value="MA">Maranhão</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option><option value="MG">Minas Gerais</option><option value="PA">Pará</option><option value="PB">Paraíba</option><option value="PR">Paraná</option><option value="PE">Pernambuco</option><option value="PI">Piauí</option><option value="RJ">Rio de Janeiro</option><option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option><option value="RO">Rondônia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option><option value="SP">São Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="zipCode">CEP *</label>
                    <input type="text" id="zipCode" value={customerAddress.zipCode} onChange={(e) => setCustomerAddress({...customerAddress, zipCode: formatCEP(e.target.value)})} placeholder="00000-000" className="form-input" maxLength={9} required/>
                </div>
            </div>

            <div className="card-form">
                <div className="form-header"><CreditCard size={20} /><h3>Dados do cartão</h3></div>
                <div className="security-notice"><Shield size={16} /><p>Seus dados de pagamento são processados de forma segura pelo Stripe.</p></div>
                <div className="card-elements">
                    <div className="form-group">
                        <label>Número do cartão *</label>
                        <div className="stripe-element-container"><CardNumberElement options={{ style: { base: { fontSize: '16px', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } }, placeholder: '1234 1234 1234 1234' }} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Data de validade *</label>
                            <div className="stripe-element-container"><CardExpiryElement options={{ style: { base: { fontSize: '16px', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } }, placeholder: 'MM/AA' }} /></div>
                        </div>
                        <div className="form-group">
                            <label>CVC *</label>
                            <div className="stripe-element-container"><CardCvcElement options={{ style: { base: { fontSize: '16px', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } }, placeholder: '123' }} /></div>
                        </div>
                    </div>
                </div>
            </div>

            <button className="submit-button" disabled={!stripe || loading} type="submit">
                {loading ? 'Processando...' : `Assinar Plano ${selectedPlan.name} - R$ ${selectedPlan.price.toFixed(2)}/mês`}
            </button>
            <div className="security-badge"><Lock size={14} /><span>Pagamento seguro e criptografado</span></div>
            <div className="subscription-terms"><p>Ao assinar, você concorda com os termos de serviço. A assinatura será renovada automaticamente a cada mês.</p></div>
        </form>
        </>
    );
};

export default CheckoutForm;