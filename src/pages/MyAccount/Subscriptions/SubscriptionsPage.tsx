import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
    Check,
    X,
    Download,
    ChevronRight
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import './SubscriptionsStyle.css';
import Header from '../../../components/Header/Header.tsx';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner.tsx';

interface Subscription {
    plan: string;
    price: number;
    status: 'active' | 'inactive';
    nextRenewal: string;
    paymentMethod: {
        type: string;
        lastDigits: string;
    };
}

interface BillingHistory {
    date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    invoiceUrl?: string;
}

export default function SubscriptionsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentSubscription: Subscription = {
        plan: 'Profissional',
        price: 99.90,
        status: 'active',
        nextRenewal: '15 de Setembro de 2025',
        paymentMethod: {
            type: 'Cartão de Crédito',
            lastDigits: '4242'
        }
    };

    const billingHistory: BillingHistory[] = [
        {
            date: '15/08/2025',
            description: 'Plano Profissional',
            amount: 99.90,
            status: 'paid',
            invoiceUrl: '#'
        },
        {
            date: '15/07/2025',
            description: 'Plano Profissional',
            amount: 99.90,
            status: 'paid',
            invoiceUrl: '#'
        }
    ];

    const plans = [
        {
            name: 'Plano Básico',
            description: 'Ideal para começar.',
            price: 49.90,
            features: ['Até 5 usuários'],
            current: false
        },
        {
            name: 'Plano Empresa',
            description: 'Para grandes equipes.',
            price: 199.90,
            features: ['Usuários ilimitados'],
            current: false
        }
    ];

    const handleManageSubscription = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChangePlan = (planName: string) => {
        setIsLoading(true);
        // Simular carregamento
        setTimeout(() => {
            toast.info(`Mudança para ${planName} será implementada em breve!`);
            setIsLoading(false);
        }, 1000);
    };

    const handleChangePaymentMethod = () => {
        setIsLoading(true);
        // Simular carregamento
        setTimeout(() => {
            toast.info('Alteração de método de pagamento será implementada em breve!');
            setIsModalOpen(false);
            setIsLoading(false);
        }, 1000);
    };

    const handleCancelSubscription = () => {
        if (window.confirm('Tem certeza que deseja cancelar sua assinatura?')) {
            setIsLoading(true);
            // Simular carregamento
            setTimeout(() => {
                toast.success('Assinatura cancelada com sucesso!');
                setIsModalOpen(false);
                setIsLoading(false);
            }, 1000);
        }
    };

    const handleDownloadInvoice = () => {
        setIsLoading(true);
        // Simular carregamento
        setTimeout(() => {
            toast.info('Download da fatura será implementado em breve!');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="subscriptions-container">
            <LoadingSpinner isLoading={isLoading} />
            <Header showOptions={false} showMenu={false} showBackButton={true} />
            
            <main className="main-content">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">Minhas Assinaturas</h1>
                        <p className="page-subtitle">
                            Gerencie seu plano e veja seu histórico de pagamentos.
                        </p>
                    </div>

                    <div className="current-plan-section">
                        <h2 className="section-title">Seu Plano Atual</h2>
                        <div className="current-plan-card">
                            <div className="plan-badges">
                                <span className="plan-badge">{currentSubscription.plan}</span>
                                <span className="status-badge">Ativo</span>
                            </div>
                            <p className="plan-price">
                                R$ {currentSubscription.price.toFixed(2).replace('.', ',')}
                                <span className="price-period">/mês</span>
                            </p>
                            <p className="renewal-info">
                                Sua assinatura será renovada em {currentSubscription.nextRenewal}.
                            </p>
                            <button 
                                onClick={handleManageSubscription}
                                className="manage-button"
                            >
                                Gerenciar Assinatura
                            </button>
                        </div>
                    </div>

                    <div className="payment-method-section">
                        <h2 className="section-title">Método de Pagamento</h2>
                        <div className="payment-method-card">
                            <div className="payment-info">
                                <svg 
                                    className="payment-icon" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="payment-type">{currentSubscription.paymentMethod.type}</p>
                                    <p className="payment-digits">Final **** {currentSubscription.paymentMethod.lastDigits}</p>
                                </div>
                            </div>
                            <button className="change-payment-button">Alterar</button>
                        </div>
                    </div>

                    <div className="other-plans-section">
                        <h2 className="section-title">Outros Planos</h2>
                        <div className="plans-grid">
                            {plans.map((plan) => (
                                <div key={plan.name} className="plan-card">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <p className="plan-description">{plan.description}</p>
                                    <p className="plan-price-secondary">
                                        R$ {plan.price.toFixed(2).replace('.', ',')}
                                        <span className="price-period">/mês</span>
                                    </p>
                                    <ul className="plan-features">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="feature-item">
                                                <Check size={20} className="check-icon" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        onClick={() => handleChangePlan(plan.name)}
                                        className="change-plan-button"
                                    >
                                        Mudar para {plan.name.split(' ')[1]}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="billing-history-section">
                        <h2 className="section-title">Histórico de Faturamento</h2>
                        <table className="billing-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th>Fatura</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingHistory.map((item) => (
                                    <tr key={item.date}>
                                        <td>{item.date}</td>
                                        <td>{item.description}</td>
                                        <td>R$ {item.amount.toFixed(2).replace('.', ',')}</td>
                                        <td>
                                            <span className={`status-badge-table ${item.status}`}>
                                                {item.status === 'paid' ? 'Pago' : item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={handleDownloadInvoice}
                                                className="download-button"
                                            >
                                                <Download size={16} />
                                                Baixar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button onClick={handleCloseModal} className="modal-close-button">
                                <X size={24} />
                            </button>

                            <h2 className="modal-title">Gerenciar Assinatura</h2>
                            <p className="modal-subtitle">O que você gostaria de fazer?</p>

                            <div className="modal-options">
                                <button 
                                    onClick={handleChangePaymentMethod}
                                    className="modal-option"
                                >
                                    <svg 
                                        className="option-icon" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <div className="option-content">
                                        <p className="option-title">Alterar método de pagamento</p>
                                        <p className="option-description">Atualize seu cartão de crédito.</p>
                                    </div>
                                    <ChevronRight size={20} className="option-arrow" />
                                </button>

                                <button 
                                    onClick={handleCancelSubscription}
                                    className="modal-option"
                                >
                                    <svg 
                                        className="option-icon cancel" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    <div className="option-content">
                                        <p className="option-title cancel">Cancelar assinatura</p>
                                        <p className="option-description">Seu plano ficará ativo até o fim do ciclo.</p>
                                    </div>
                                    <ChevronRight size={20} className="option-arrow" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
