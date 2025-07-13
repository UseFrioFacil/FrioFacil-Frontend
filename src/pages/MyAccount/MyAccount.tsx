import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, CreditCard, XCircle, ShieldAlert } from 'lucide-react';
import './MyAccountStyle.css';
import Header from '../../components/Header/Header.tsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.tsx';

// --- INTERFACES DE DADOS ---

// Interface atualizada para corresponder à resposta da sua API.
interface UserProfile {
    cpf: string;
    fullName: string;
    phone: string;
    email: string;
    memberSince: string; 
}

interface Subscription {
    id: string;
    planName: string;
    status: 'Ativo' | 'Inativo' | 'Cancelado';
    nextBillingDate: string; 
    price: string;
}

// --- MOCKS DE API (PARA FUNCIONALIDADES AINDA NÃO IMPLEMENTADAS) ---

const fetchSubscriptionsMock = (token: string): Promise<{ data: Subscription[] }> => {
    console.log("Ainda não ta pronto pq vou ter que fazer uma requisição na ApiNode", token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: [
                    { id: 'sub_1', planName: 'Plano Frio-Forte', status: 'Ativo', nextBillingDate: '2025-08-01T10:00:00Z', price: 'R$ 99,90/mês' },
                    { id: 'sub_2', planName: 'Plano Gelo-Extra', status: 'Ativo', nextBillingDate: '2025-07-20T10:00:00Z', price: 'R$ 149,90/mês' },
                ]
            });
        }, 1200);
    });
};

const cancelSubscriptionMock = (subscriptionId: string, token: string): Promise<{ data: { message: string } }> => {
    console.log(`Canceling subscription ${subscriptionId} with token:`, token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { message: 'Assinatura cancelada com sucesso!' } });
        }, 500);
    });
};

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
    
    // Estados para o modal de deleção
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
                // Requisição real para o perfil do usuário
                const profilePromise = axios.get('http://localhost:5103/api/friofacil/myaccount', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Promise.all para buscar dados do perfil e assinaturas em paralelo
                const [profileResponse, subsResponse] = await Promise.all([
                    profilePromise,
                    fetchSubscriptionsMock(token) // Mantendo o mock para assinaturas
                ]);

                // Mapeia os dados da API para o formato esperado pelo estado do componente
                const apiData = profileResponse.data;
                const formattedUserProfile: UserProfile = {
                    fullName: apiData.fullname,
                    email: apiData.email,
                    memberSince: apiData.createdAt,
                    cpf: apiData.cpf,
                    phone: apiData.phone
                };
                
                setUserProfile(formattedUserProfile);
                setSubscriptions(subsResponse.data);

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
            await cancelSubscriptionMock(subscriptionId, token);
            setSubscriptions(prevSubs =>
                prevSubs.map(sub =>
                    sub.id === subscriptionId ? { ...sub, status: 'Cancelado' } : sub
                )
            );
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
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
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
                                            <h3>{sub.planName}</h3>
                                            <span className={`status-badge`}>{sub.status}</span>
                                        </div>
                                        <div className="subscription-body">
                                            <p><strong>Preço:</strong> {sub.price}</p>
                                            {sub.status === 'Ativo' && (
                                                <p><strong>Próxima cobrança:</strong> {formatDate(sub.nextBillingDate)}</p>
                                            )}
                                            {sub.status === 'Cancelado' && (
                                                <p>O acesso permanecerá até o fim do ciclo de cobrança.</p>
                                            )}
                                        </div>
                                        {sub.status === 'Ativo' && (
                                            <div className="subscription-footer">
                                                <button 
                                                    onClick={() => handleCancelSubscription(sub.id)}
                                                    className="cancel-button"
                                                >
                                                    <XCircle size={16} /> Cancelar Assinatura
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Você ainda não possui nenhuma assinatura ativa.</p>
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