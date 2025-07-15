import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, CreditCard, XCircle, ShieldAlert, Building2 } from 'lucide-react';
import './MyAccountStyle.css';
import Header from '../../components/Header/Header.tsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.tsx';

// --- INTERFACES DE DADOS ---

interface UserProfile {
    cpf: string;
    fullName: string;
    phone: string;
    email: string;
    memberSince: string;
}

interface Subscription {
    id: string;
    status: 'Ativo' | 'Inativo' | 'Cancelado';
    planName: string;
    companyId: string;
    tradeName?: string;
    nextBillingDate: string | null;
    paymentMethod: string;
}

// --- MOCK RESTANTE ---

const deleteAccountMock = (token: string): Promise<{ data: { message: string } }> => {
    console.log(`Deleting account with token:`, token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { message: 'Conta deletada permanentemente.' } });
        }, 1000);
    });
};


// --- COMPONENTE PRINCIPAL ---

export default function MinhaContaPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    useEffect(() => {
        const fetchAccountData = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.warn("Sessão expirada. Por favor, faça login novamente.");
                navigate('/login');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const profilePromise = axios.get('http://localhost:5103/api/friofacil/myaccount', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const subscriptionsPromise = axios.get('http://localhost:25565/api/subscriptions/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const [profileResponse, subsResponse] = await Promise.all([
                    profilePromise,
                    subscriptionsPromise
                ]);

                // Mapeamento dos dados do perfil
                const profileApiData = profileResponse.data;
                setUserProfile({
                    fullName: profileApiData.fullname,
                    email: profileApiData.email,
                    memberSince: profileApiData.createdAt,
                    cpf: profileApiData.cpf,
                    phone: profileApiData.phone
                });
                
                // Mapeamento e filtragem dos dados da API de assinaturas
                const subsApiData = subsResponse.data.data;
                const allSubscriptions: Subscription[] = subsApiData.map((sub: any) => ({
                    id: sub.id,
                    status: sub.status === 'active' ? 'Ativo' : (sub.status === 'canceled' ? 'Cancelado' : 'Inativo'),
                    planName: `Plano ${sub.plan_type.charAt(0).toUpperCase() + sub.plan_type.slice(1)}`,
                    companyId: sub.companyid,
                    tradeName: sub.tradename,
                    nextBillingDate: sub.next_billing_date,
                    paymentMethod: `${sub.default_payment_method.card.brand.toUpperCase()} final ${sub.default_payment_method.card.last4}`
                }));

                // 1. FILTRANDO PARA REMOVER AS ASSINATURAS CANCELADAS
                const activeSubscriptions = allSubscriptions.filter(sub => sub.status !== 'Cancelado');
                
                setSubscriptions(activeSubscriptions);

            } catch (err) {
                console.error("Erro ao buscar dados da conta:", err);
                setError("Não foi possível carregar seus dados. Tente recarregar a página.");
                toast.error("Ocorreu um erro ao carregar a página.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccountData();
    }, [navigate]);

    const handleCancelSubscription = async (subscriptionId: string) => {
        if (!window.confirm("Você tem certeza que deseja cancelar esta assinatura? Esta ação não pode ser desfeita.")) {
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Sua sessão expirou. Faça login novamente.");
            navigate('/login');
            return;
        }

        try {
            await axios.post(`http://localhost:25565/api/cancel-subscription/${subscriptionId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Ao cancelar, a assinatura é removida da lista em vez de ter o status alterado
            setSubscriptions(prevSubs => prevSubs.filter(sub => sub.id !== subscriptionId));
            
            toast.success("Assinatura cancelada com sucesso!");

        } catch (err) {
            console.error("Erro ao cancelar assinatura:", err);
            toast.error("Não foi possível cancelar a assinatura. Tente novamente.");
        }
    };

    const handleConfirmDelete = async () => {
        if (confirmationText !== 'DELETAR CONTA') {
            toast.error("O texto de confirmação está incorreto.");
            return;
        }
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Sua sessão expirou. Faça login novamente.");
            navigate('/login');
            return;
        }
        try {
            await deleteAccountMock(token);
            toast.success("Sua conta foi deletada com sucesso. Sentiremos sua falta!");
            localStorage.removeItem("accessToken");
            setIsDeleteModalOpen(false);
            navigate('/login');
        } catch (err) {
            console.error("Erro ao deletar conta:", err);
            toast.error("Não foi possível deletar sua conta. Por favor, entre em contato com o suporte.");
        }
    };
    
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'N/A';
        }
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return <LoadingSpinner isLoading={true} />;
    }

    if (error) {
        return (
            <div className="account-container error-container">
                <h2>Oops! Algo deu errado.</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Recarregar Página</button>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Header showBackButton={true} showMenu={false} showOptions={false}/>
            
            <div className="account-container">
                <main className="account-main">
                    <h1 className="account-title">Minha Conta</h1>

                    <section className="account-section">
                        <h2 className="section-title"><User className="title-icon" /> Informações Pessoais</h2>
                        <div className="card info-card">
                            <div className="info-row">
                                <strong>Nome Completo:</strong>
                                <span>{userProfile?.fullName}</span>
                            </div>
                            <div className="info-row">
                                <strong>CPF:</strong>
                                <span>{userProfile?.cpf}</span>
                            </div>
                            <div className="info-row">
                                <strong>Telefone:</strong>
                                <span>{userProfile?.phone}</span>
                            </div>
                            <div className="info-row">
                                <strong>Email:</strong>
                                <span>{userProfile?.email}</span>
                            </div>
                            <div className="info-row">
                                <strong>Membro desde:</strong>
                                <span>{userProfile ? formatDate(userProfile.memberSince) : ''}</span>
                            </div>
                        </div>
                    </section>
                    
                    <section className="account-section">
                        <h2 className="section-title"><CreditCard className="title-icon" /> Minhas Assinaturas</h2>
                        {subscriptions.length > 0 ? (
                            <div className="subscriptions-grid">
                                {subscriptions.map(sub => (
                                    <div key={sub.id} className={`card subscription-card status-${sub.status.toLowerCase()}`}>
                                        <div className="subscription-header">
                                            <h3><Building2 size={18} className="title-icon"/> {sub.tradeName || sub.planName}</h3>
                                            <span className={`status-badge`}>{sub.status}</span>
                                        </div>
                                        <div className="subscription-body">
                                            {sub.tradeName && <p><strong>Plano:</strong> {sub.planName}</p>}
                                            <p><strong>Pagamento:</strong> {sub.paymentMethod}</p>
                                            {sub.status === 'Ativo' && (
                                                <p><strong>Próxima cobrança:</strong> {formatDate(sub.nextBillingDate)}</p>
                                            )}
                                        </div>
                                        {/* O botão de cancelar só aparece para assinaturas ativas, que são as únicas visíveis agora */}
                                        <div className="subscription-footer">
                                            <button 
                                                onClick={() => handleCancelSubscription(sub.id)}
                                                className="cancel-button"
                                            >
                                                <XCircle size={16} /> Cancelar Assinatura
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card info-card">
                                <p>Você não possui nenhuma assinatura ativa.</p>
                            </div>
                        )}
                    </section>

                    <section className="account-section">
                        <h2 className="section-title danger-title"><ShieldAlert className="title-icon danger-icon" /> Zona de Perigo</h2>
                        <div className="card danger-zone-card">
                            <div className="danger-zone-content">
                                <div>
                                    <h3 className="danger-zone-subtitle">Deletar esta conta</h3>
                                    <p className="danger-zone-text">Uma vez que você deletar sua conta, não há como voltar atrás. Tenha certeza absoluta.</p>
                                </div>
                                <button onClick={() => setIsDeleteModalOpen(true)} className="delete-account-button">
                                    Deletar minha conta
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {isDeleteModalOpen && (
                 <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Você tem certeza absoluta?</h3>
                        <p className="modal-text">
                            Esta ação é irreversível. Todos os seus dados, empresas e informações associadas serão permanentemente deletados. 
                            Para confirmar, por favor, digite <strong>DELETAR CONTA</strong> no campo abaixo.
                        </p>
                        <input 
                            type="text"
                            className="modal-input"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="DELETAR CONTA"
                        />
                        <div className="modal-actions">
                            <button 
                                className="modal-button cancel"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setConfirmationText('');
                                }}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="modal-button confirm-delete"
                                onClick={handleConfirmDelete}
                                disabled={confirmationText !== 'DELETAR CONTA'}
                            >
                                Eu entendo, deletar minha conta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}