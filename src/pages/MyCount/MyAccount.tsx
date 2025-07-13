import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios'; // Descomente quando for usar a API real
import { toast } from 'react-toastify';
import { User, CreditCard, XCircle } from 'lucide-react';
import './MyAccountStyle.css'; // Nome do arquivo CSS atualizado
import Header from '../../components/Header/Header.tsx'; // Componente Header atualizado
import LoadingSpinner from '../../components/Loading/LoadingSpinner.tsx';

// --- INTERFACES DE DADOS ---

interface UserProfile {
    userId: string;
    fullName: string;
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


// Mock para a API de perfil do usuário
const fetchUserProfileMock = (token: string): Promise<{ data: UserProfile }> => {
    console.log("Fetching user profile with token:", token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: {
                    userId: 'user-123',
                    fullName: 'Carlos Alberto de Nóbrega',
                    email: 'carlos.alberto@email.com',
                    memberSince: '2023-01-15T10:00:00Z',
                }
            });
        }, 800);
    });
};

// Mock para a API de assinaturas
const fetchSubscriptionsMock = (token: string): Promise<{ data: Subscription[] }> => {
    console.log("Fetching subscriptions with token:", token);
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

// Mock para cancelar assinatura
const cancelSubscriptionMock = (subscriptionId: string, token: string): Promise<{ data: { message: string } }> => {
    console.log(`Canceling subscription ${subscriptionId} with token:`, token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { message: 'Assinatura cancelada com sucesso!' } });
        }, 500);
    });
};


// --- COMPONENTE PRINCIPAL ---

export default function MinhaContaPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

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
                // Realiza as duas chamadas de API em paralelo
                const [profileResponse, subsResponse] = await Promise.all([
                    // Substitua 'fetchUserProfileMock' pela sua chamada real do axios
                    // ex: axios.get<UserProfile>('http://localhost:5103/api/friofacil/user/profile', config)
                    fetchUserProfileMock(token),
                    // Substitua 'fetchSubscriptionsMock' pela sua chamada real do axios
                    // ex: axios.get<Subscription[]>('http://localhost:5104/api/billing/subscriptions', config)
                    fetchSubscriptionsMock(token)
                ]);

                setUserProfile(profileResponse.data);
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
        // Substituindo window.confirm por um toast de confirmação ou um modal seria o ideal.
        // Por enquanto, mantemos o confirm para simplicidade.
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
            // Chamada à API para cancelar
            await cancelSubscriptionMock(subscriptionId, token);
            
            // Atualiza o estado local para refletir a mudança na UI
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
        // Usamos um container geral para aplicar a cor de fundo
        <div className="page-wrapper">
            <Header showBackButton={true} showMenu={false} showOptions={false}/>
            
            <div className="account-container">
                <main className="account-main">
                    <h1 className="account-title">Minha Conta</h1>

                    {/* Seção de Informações do Usuário */}
                    <section className="account-section">
                        <h2 className="section-title"><User className="title-icon" /> Informações Pessoais</h2>
                        <div className="card info-card">
                            <div className="info-row">
                                <strong>Nome Completo:</strong>
                                <span>{userProfile?.fullName}</span>
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

                    {/* Seção de Assinaturas */}
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
                </main>
            </div>
        </div>
    );
}
