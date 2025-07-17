import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, CreditCard, XCircle, ShieldAlert, Building2, AlertTriangle, Loader2 } from 'lucide-react';
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

// --- COMPONENTE PRINCIPAL ---
export default function MinhaContaPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false); // Estado para o processo de deleção
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    
    // Estados para o modal de DELEÇÃO DE CONTA
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    // Estados para o modal de CANCELAMENTO DE ASSINATURA
    const [isCancelSubModalOpen, setIsCancelSubModalOpen] = useState(false);
    const [subscriptionToCancel, setSubscriptionToCancel] = useState<Subscription | null>(null);

    useEffect(() => {
        // ... (lógica de fetch de dados permanece a mesma)
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

                const profileApiData = profileResponse.data;
                setUserProfile({
                    fullName: profileApiData.fullname,
                    email: profileApiData.email,
                    memberSince: profileApiData.createdAt,
                    cpf: profileApiData.cpf,
                    phone: profileApiData.phone
                });
                
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

    const openCancelSubscriptionModal = (subscription: Subscription) => {
        setSubscriptionToCancel(subscription);
        setIsCancelSubModalOpen(true);
    };

    const handleConfirmCancelSubscription = async () => {
        // ... (lógica de cancelamento de assinatura única permanece a mesma)
        if (!subscriptionToCancel) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Sua sessão expirou. Faça login novamente.");
            navigate('/login');
            return;
        }

        try {
            await axios.post(`http://localhost:25565/api/cancel-subscription/${subscriptionToCancel.id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setSubscriptions(prevSubs => prevSubs.filter(sub => sub.id !== subscriptionToCancel.id));
            toast.success("Assinatura cancelada com sucesso!");

        } catch (err) {
            console.error("Erro ao cancelar assinatura:", err);
            toast.error("Não foi possível cancelar a assinatura. Tente novamente.");
        } finally {
            setIsCancelSubModalOpen(false);
            setSubscriptionToCancel(null);
        }
    };
    
    // Lógica de DELEÇÃO DE CONTA ATUALIZADA
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
        
        setIsDeleting(true); // Ativa o estado de carregamento

        try {
            // 1. Cancelar todas as assinaturas primeiro
            toast.info("Cancelando assinaturas...");
            for (const sub of subscriptions) {
                try {
                    await axios.post(`http://localhost:25565/api/cancel-subscription/${sub.id}`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (subError) {
                    console.error(`Falha ao cancelar a assinatura ${sub.id}:`, subError);
                    throw new Error(`Não foi possível cancelar a assinatura para ${sub.tradeName || sub.planName}. A exclusão da conta foi abortada.`);
                }
            }

            // 2. Se todas as assinaturas foram canceladas, deletar a conta do usuário
            toast.info("Deletando sua conta...");
            await axios.delete('http://localhost:5103/api/friofacil/userdelete', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success("Sua conta e todas as assinaturas foram deletadas com sucesso!");
            localStorage.removeItem("accessToken");
            setIsDeleteModalOpen(false);
            navigate('/');

        } catch (err: any) {
            console.error("Erro no processo de deletar conta:", err);
            toast.error(err.message || "Não foi possível deletar sua conta. Por favor, entre em contato com o suporte.");
        } finally {
            setIsDeleting(false); // Desativa o estado de carregamento
            setConfirmationText('');
        }
    };
    
    const formatDate = (dateString: string | null) => {
        // ... (função formatDate permanece a mesma)
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    if (isLoading) return <LoadingSpinner isLoading={true} />;
    if (error) return (
        <div className="account-container error-container">
            <h2>Oops! Algo deu errado.</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Recarregar Página</button>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Header showBackButton={true} showMenu={false} showOptions={false}/>
            
            <div className="account-container">
                <main className="account-main">
                    {/* ... (seções de Informações Pessoais e Minhas Assinaturas permanecem as mesmas) ... */}
                    <h1 className="account-title">Minha Conta</h1>

                    <section className="account-section">
                        <h2 className="section-title"><User className="title-icon" /> Informações Pessoais</h2>
                        <div className="card info-card">
                            <div className="info-row"><strong>Nome Completo:</strong><span>{userProfile?.fullName}</span></div>
                            <div className="info-row"><strong>CPF:</strong><span>{userProfile?.cpf}</span></div>
                            <div className="info-row"><strong>Telefone:</strong><span>{userProfile?.phone}</span></div>
                            <div className="info-row"><strong>Email:</strong><span>{userProfile?.email}</span></div>
                            <div className="info-row"><strong>Membro desde:</strong><span>{userProfile ? formatDate(userProfile.memberSince) : ''}</span></div>
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
                                            {sub.status === 'Ativo' && <p><strong>Próxima cobrança:</strong> {formatDate(sub.nextBillingDate)}</p>}
                                        </div>
                                        <div className="subscription-footer">
                                            <button onClick={() => openCancelSubscriptionModal(sub)} className="cancel-button">
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

            {/* Modal para DELETAR A CONTA */}
            {isDeleteModalOpen && (
                 <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Você tem certeza absoluta?</h3>
                        <p className="modal-text">
                            Esta ação é irreversível. Todas as suas assinaturas ativas serão canceladas e seus dados permanentemente deletados. 
                            Para confirmar, digite <strong>DELETAR CONTA</strong> abaixo.
                        </p>
                        <input type="text" className="modal-input" value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} placeholder="DELETAR CONTA" disabled={isDeleting}/>
                        <div className="modal-actions">
                            <button className="modal-button cancel" onClick={() => { setIsDeleteModalOpen(false); setConfirmationText(''); }} disabled={isDeleting}>
                                Voltar
                            </button>
                            <button className="modal-button confirm-delete" onClick={handleConfirmDelete} disabled={confirmationText !== 'DELETAR CONTA' || isDeleting}>
                                {isDeleting ? (
                                    <><Loader2 size={16} className="animate-spin" /> Processando...</>
                                ) : (
                                    'Eu entendo, deletar minha conta'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para CANCELAR ASSINATURA */}
            {isCancelSubModalOpen && (
                 <div className="modal-overlay">
                    <div className="modal-content">
                        <div className='modal-icon-container warning'>
                           <AlertTriangle size={48} />
                        </div>
                        <h3 className="modal-title">Cancelar Assinatura</h3>
                        <p className="modal-text">
                            Você tem certeza que deseja cancelar a assinatura para a empresa <strong>{subscriptionToCancel?.tradeName || subscriptionToCancel?.planName}</strong>?
                            <br/>
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="modal-actions">
                            <button className="modal-button cancel" onClick={() => { setIsCancelSubModalOpen(false); setSubscriptionToCancel(null); }}>
                                Voltar
                            </button>
                            <button className="modal-button confirm-delete" onClick={handleConfirmCancelSubscription}>
                                Sim, cancelar assinatura
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}