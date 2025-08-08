import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URLS, PAYMENT_API_URLS } from '../../config/api';
import { 
    User, 
    CreditCard, 
    XCircle, 
    Building2, 
    AlertTriangle, 
    Loader2,
    Settings,
    MessageCircle,
    Trash2,
    Eye,
    EyeOff,
    Key,
    Shield,
    HelpCircle,
    FileText,
    Calendar,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
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
    address?: string;
    city?: string;
    state?: string;
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

interface SecuritySettings {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: number;
    loginHistory: Array<{
        date: string;
        location: string;
        device: string;
    }>;
}

interface AccountSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    language: string;
    timezone: string;
}

interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
    status: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado';
    createdAt: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function MinhaContaPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('personal');
    
    // Estados dos dados
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        twoFactorEnabled: false,
        lastPasswordChange: '',
        activeSessions: 1,
        loginHistory: []
    });
    const [accountSettings, setAccountSettings] = useState<AccountSettings>({
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo'
    });
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    
    // Estados para modais
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCancelSubModalOpen, setIsCancelSubModalOpen] = useState(false);
    const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
    
    // Estados para formulários
    const [confirmationText, setConfirmationText] = useState('');
    const [subscriptionToCancel, setSubscriptionToCancel] = useState<Subscription | null>(null);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        description: '',
        priority: 'Média' as const
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        fetchAccountData();
    }, [navigate]);

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
            const profilePromise = axios.get(API_URLS.MY_ACCOUNT, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const subscriptionsPromise = axios.get(PAYMENT_API_URLS.GET_SUBSCRIPTIONS, {
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
                phone: profileApiData.phone,
                address: profileApiData.address || '',
                city: profileApiData.city || '',
                state: profileApiData.state || ''
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

            // Simular dados de segurança e configurações
            setSecuritySettings({
                twoFactorEnabled: false,
                lastPasswordChange: '2024-01-15',
                activeSessions: 2,
                loginHistory: [
                    { date: '2024-01-20 14:30', location: 'São Paulo, SP', device: 'Chrome - Windows' },
                    { date: '2024-01-19 09:15', location: 'Rio de Janeiro, RJ', device: 'Safari - iPhone' },
                    { date: '2024-01-18 16:45', location: 'São Paulo, SP', device: 'Chrome - Windows' }
                ]
            });

            // Simular tickets de suporte
            setSupportTickets([
                {
                    id: '1',
                    subject: 'Problema com login',
                    description: 'Não consigo acessar minha conta',
                    priority: 'Alta',
                    status: 'Resolvido',
                    createdAt: '2024-01-15'
                },
                {
                    id: '2',
                    subject: 'Dúvida sobre assinatura',
                    description: 'Gostaria de saber mais sobre o plano premium',
                    priority: 'Baixa',
                    status: 'Aberto',
                    createdAt: '2024-01-20'
                }
            ]);

        } catch (err) {
            console.error("Erro ao buscar dados da conta:", err);
            setError("Não foi possível carregar seus dados. Tente recarregar a página.");
            toast.error("Ocorreu um erro ao carregar a página.");
        } finally {
            setIsLoading(false);
        }
    };

    // Funções para gerenciar abas
    const tabs = [
        { id: 'personal', label: 'Informações Pessoais', icon: User },
        { id: 'security', label: 'Segurança e Acesso', icon: Shield },
        { id: 'payments', label: 'Pagamentos e Assinaturas', icon: CreditCard },
        { id: 'settings', label: 'Configurações da Conta', icon: Settings },
        { id: 'support', label: 'Suporte e Tickets', icon: HelpCircle },
        { id: 'danger', label: 'Encerramento de Conta', icon: Trash2 }
    ];

    // Funções para modais
    const openCancelSubscriptionModal = (subscription: Subscription) => {
        setSubscriptionToCancel(subscription);
        setIsCancelSubModalOpen(true);
    };

    const handleConfirmCancelSubscription = async () => {
        if (!subscriptionToCancel) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Sua sessão expirou. Faça login novamente.");
            navigate('/login');
            return;
        }

        try {
            await axios.post(`${PAYMENT_API_URLS.CANCEL_SUBSCRIPTION}/${subscriptionToCancel.id}`, {}, {
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

    const handleCreateTicket = async () => {
        if (!newTicket.subject || !newTicket.description) {
            toast.error("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            // Simular criação de ticket
            const newTicketData: SupportTicket = {
                id: Date.now().toString(),
                subject: newTicket.subject,
                description: newTicket.description,
                priority: newTicket.priority,
                status: 'Aberto',
                createdAt: new Date().toISOString().split('T')[0]
            };

            setSupportTickets(prev => [newTicketData, ...prev]);
            setNewTicket({ subject: '', description: '', priority: 'Média' });
            setIsNewTicketModalOpen(false);
            toast.success("Ticket criado com sucesso!");
        } catch (err) {
            toast.error("Erro ao criar ticket. Tente novamente.");
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        try {
            // Simular alteração de senha
            toast.success("Senha alterada com sucesso!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setIsPasswordModalOpen(false);
        } catch (err) {
            toast.error("Erro ao alterar senha. Tente novamente.");
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
        
        setIsDeleting(true);

        try {
            // Cancelar todas as assinaturas primeiro
            toast.info("Cancelando assinaturas...");
            for (const sub of subscriptions) {
                try {
                    await axios.post(`${PAYMENT_API_URLS.CANCEL_SUBSCRIPTION}/${sub.id}`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (subError) {
                    console.error(`Falha ao cancelar a assinatura ${sub.id}:`, subError);
                    throw new Error(`Não foi possível cancelar a assinatura para ${sub.tradeName || sub.planName}. A exclusão da conta foi abortada.`);
                }
            }

            // Deletar a conta do usuário
            toast.info("Deletando sua conta...");
            await axios.delete(API_URLS.USER_DELETE, {
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
            setIsDeleting(false);
            setConfirmationText('');
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
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
                    <h1 className="account-title">Minha Conta</h1>

                    {/* Navegação por Abas */}
                    <div className="tabs-navigation">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={20} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Conteúdo das Abas */}
                    <div className="tab-content">
                        {/* Aba: Informações Pessoais */}
                        {activeTab === 'personal' && (
                            <section className="account-section">
                                <h2 className="section-title"><User className="title-icon" /> Informações Pessoais</h2>
                                <div className="card info-card">
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <User size={20} className="info-icon" />
                                            <div>
                                                <strong>Nome Completo</strong>
                                                <span>{userProfile?.fullName}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <FileText size={20} className="info-icon" />
                                            <div>
                                                <strong>CPF</strong>
                                                <span>{userProfile?.cpf}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Phone size={20} className="info-icon" />
                                            <div>
                                                <strong>Telefone</strong>
                                                <span>{userProfile?.phone}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Mail size={20} className="info-icon" />
                                            <div>
                                                <strong>Email</strong>
                                                <span>{userProfile?.email}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Calendar size={20} className="info-icon" />
                                            <div>
                                                <strong>Membro desde</strong>
                                                <span>{userProfile ? formatDate(userProfile.memberSince) : ''}</span>
                                            </div>
                                        </div>
                                        {userProfile?.address && (
                                            <div className="info-item">
                                                <MapPin size={20} className="info-icon" />
                                                <div>
                                                    <strong>Endereço</strong>
                                                    <span>{userProfile.address}, {userProfile.city} - {userProfile.state}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-actions">
                                        <button className="edit-button">
                                            <Settings size={16} />
                                            Editar Informações
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Aba: Segurança e Acesso */}
                        {activeTab === 'security' && (
                            <section className="account-section">
                                <h2 className="section-title"><Shield className="title-icon" /> Segurança e Acesso</h2>
                                
                                <div className="security-grid">
                                    <div className="card security-card">
                                        <h3>Autenticação de Dois Fatores</h3>
                                        <p>Adicione uma camada extra de segurança à sua conta</p>
                                        <div className="security-status">
                                            <span className={`status-indicator ${securitySettings.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                                                {securitySettings.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                                            </span>
                                        </div>
                                        <button 
                                            className="security-button"
                                            onClick={() => setIsTwoFactorModalOpen(true)}
                                        >
                                            {securitySettings.twoFactorEnabled ? 'Desativar' : 'Ativar'} 2FA
                                        </button>
                                    </div>

                                    <div className="card security-card">
                                        <h3>Alterar Senha</h3>
                                        <p>Última alteração: {formatDate(securitySettings.lastPasswordChange)}</p>
                                        <button 
                                            className="security-button"
                                            onClick={() => setIsPasswordModalOpen(true)}
                                        >
                                            <Key size={16} />
                                            Alterar Senha
                                        </button>
                                    </div>

                                    <div className="card security-card">
                                        <h3>Sessões Ativas</h3>
                                        <p>{securitySettings.activeSessions} sessão(ões) ativa(s)</p>
                                        <button className="security-button">
                                            <Eye size={16} />
                                            Ver Sessões
                                        </button>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3>Histórico de Login</h3>
                                    <div className="login-history">
                                        {securitySettings.loginHistory.map((login, index) => (
                                            <div key={index} className="login-item">
                                                <div className="login-info">
                                                    <span className="login-date">{formatDateTime(login.date)}</span>
                                                    <span className="login-location">{login.location}</span>
                                                    <span className="login-device">{login.device}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Aba: Pagamentos e Assinaturas */}
                        {activeTab === 'payments' && (
                            <section className="account-section">
                                <h2 className="section-title"><CreditCard className="title-icon" /> Pagamentos e Assinaturas</h2>
                                
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

                                <div className="card">
                                    <h3>Métodos de Pagamento</h3>
                                    <p>Gerencie seus cartões de crédito e métodos de pagamento</p>
                                    <button className="primary-button">
                                        <CreditCard size={16} />
                                        Adicionar Método de Pagamento
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* Aba: Configurações da Conta */}
                        {activeTab === 'settings' && (
                            <section className="account-section">
                                <h2 className="section-title"><Settings className="title-icon" /> Configurações da Conta</h2>
                                
                                <div className="settings-grid">
                                    <div className="card settings-card">
                                        <h3>Notificações</h3>
                                        <div className="setting-item">
                                            <div>
                                                <strong>Notificações por Email</strong>
                                                <p>Receba atualizações importantes por email</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={accountSettings.emailNotifications}
                                                    onChange={(e) => setAccountSettings(prev => ({
                                                        ...prev,
                                                        emailNotifications: e.target.checked
                                                    }))}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <div>
                                                <strong>Notificações por SMS</strong>
                                                <p>Receba alertas importantes por SMS</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={accountSettings.smsNotifications}
                                                    onChange={(e) => setAccountSettings(prev => ({
                                                        ...prev,
                                                        smsNotifications: e.target.checked
                                                    }))}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <div>
                                                <strong>Emails de Marketing</strong>
                                                <p>Receba ofertas e novidades</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={accountSettings.marketingEmails}
                                                    onChange={(e) => setAccountSettings(prev => ({
                                                        ...prev,
                                                        marketingEmails: e.target.checked
                                                    }))}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="card settings-card">
                                        <h3>Preferências</h3>
                                        <div className="setting-item">
                                            <label>Idioma</label>
                                            <select 
                                                value={accountSettings.language}
                                                onChange={(e) => setAccountSettings(prev => ({
                                                    ...prev,
                                                    language: e.target.value
                                                }))}
                                            >
                                                <option value="pt-BR">Português (Brasil)</option>
                                                <option value="en-US">English (US)</option>
                                                <option value="es-ES">Español</option>
                                            </select>
                                        </div>
                                        <div className="setting-item">
                                            <label>Fuso Horário</label>
                                            <select 
                                                value={accountSettings.timezone}
                                                onChange={(e) => setAccountSettings(prev => ({
                                                    ...prev,
                                                    timezone: e.target.value
                                                }))}
                                            >
                                                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                                                <option value="America/Manaus">Manaus (GMT-4)</option>
                                                <option value="America/Belem">Belém (GMT-3)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Aba: Suporte e Tickets */}
                        {activeTab === 'support' && (
                            <section className="account-section">
                                <h2 className="section-title"><HelpCircle className="title-icon" /> Suporte e Tickets</h2>
                                
                                <div className="support-header">
                                    <div className="card">
                                        <h3>Precisa de Ajuda?</h3>
                                        <p>Nossa equipe está aqui para ajudar você com qualquer dúvida ou problema.</p>
                                        <div className="support-actions">
                                            <button 
                                                className="primary-button"
                                                onClick={() => setIsNewTicketModalOpen(true)}
                                            >
                                                <MessageCircle size={16} />
                                                Abrir Novo Ticket
                                            </button>
                                            <button className="secondary-button">
                                                <HelpCircle size={16} />
                                                Central de Ajuda
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3>Meus Tickets</h3>
                                    {supportTickets.length > 0 ? (
                                        <div className="tickets-list">
                                            {supportTickets.map(ticket => (
                                                <div key={ticket.id} className="ticket-item">
                                                    <div className="ticket-header">
                                                        <h4>{ticket.subject}</h4>
                                                        <div className="ticket-meta">
                                                            <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                                                                {ticket.priority}
                                                            </span>
                                                            <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                                                                {ticket.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="ticket-description">{ticket.description}</p>
                                                    <div className="ticket-footer">
                                                        <span className="ticket-date">Criado em: {formatDate(ticket.createdAt)}</span>
                                                        <button className="view-ticket-button">Ver Detalhes</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Você ainda não possui tickets de suporte.</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Aba: Encerramento de Conta */}
                        {activeTab === 'danger' && (
                            <section className="account-section">
                                <h2 className="section-title danger-title"><Trash2 className="title-icon danger-icon" /> Encerramento de Conta</h2>
                                
                                <div className="card danger-zone-card">
                                    <div className="danger-zone-content">
                                        <div>
                                            <h3 className="danger-zone-subtitle">Deletar esta conta</h3>
                                            <p className="danger-zone-text">
                                                Uma vez que você deletar sua conta, não há como voltar atrás. 
                                                Todas as suas assinaturas serão canceladas e seus dados permanentemente deletados. 
                                                Tenha certeza absoluta antes de prosseguir.
                                            </p>
                                            <ul className="danger-zone-list">
                                                <li>✓ Todas as assinaturas serão canceladas</li>
                                                <li>✓ Seus dados pessoais serão deletados</li>
                                                <li>✓ Histórico de serviços será perdido</li>
                                                <li>✓ Esta ação é irreversível</li>
                                            </ul>
                                        </div>
                                        <button onClick={() => setIsDeleteModalOpen(true)} className="delete-account-button">
                                            <Trash2 size={16} />
                                            Deletar minha conta
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
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
                        <input 
                            type="text" 
                            className="modal-input" 
                            value={confirmationText} 
                            onChange={(e) => setConfirmationText(e.target.value)} 
                            placeholder="DELETAR CONTA" 
                            disabled={isDeleting}
                        />
                        <div className="modal-actions">
                            <button 
                                className="modal-button cancel" 
                                onClick={() => { setIsDeleteModalOpen(false); setConfirmationText(''); }} 
                                disabled={isDeleting}
                            >
                                Voltar
                            </button>
                            <button 
                                className="modal-button confirm-delete" 
                                onClick={handleConfirmDelete} 
                                disabled={confirmationText !== 'DELETAR CONTA' || isDeleting}
                            >
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
                            <button 
                                className="modal-button cancel" 
                                onClick={() => { setIsCancelSubModalOpen(false); setSubscriptionToCancel(null); }}
                            >
                                Voltar
                            </button>
                            <button 
                                className="modal-button confirm-delete" 
                                onClick={handleConfirmCancelSubscription}
                            >
                                Sim, cancelar assinatura
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para NOVO TICKET */}
            {isNewTicketModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Abrir Novo Ticket</h3>
                        <div className="form-group">
                            <label>Assunto</label>
                            <input 
                                type="text" 
                                value={newTicket.subject}
                                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Descreva brevemente o problema"
                            />
                        </div>
                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea 
                                value={newTicket.description}
                                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Descreva detalhadamente o problema ou dúvida"
                                rows={4}
                            />
                        </div>
                        <div className="form-group">
                            <label>Prioridade</label>
                            <select 
                                value={newTicket.priority}
                                onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                            >
                                <option value="Baixa">Baixa</option>
                                <option value="Média">Média</option>
                                <option value="Alta">Alta</option>
                                <option value="Crítica">Crítica</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="modal-button cancel" 
                                onClick={() => { setIsNewTicketModalOpen(false); setNewTicket({ subject: '', description: '', priority: 'Média' }); }}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="modal-button confirm" 
                                onClick={handleCreateTicket}
                                disabled={!newTicket.subject || !newTicket.description}
                            >
                                Criar Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para ALTERAR SENHA */}
            {isPasswordModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Alterar Senha</h3>
                        <div className="form-group">
                            <label>Senha Atual</label>
                            <div className="password-input">
                                <input 
                                    type={showPasswords.current ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="Digite sua senha atual"
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                >
                                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Nova Senha</label>
                            <div className="password-input">
                                <input 
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="Digite a nova senha"
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                >
                                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirmar Nova Senha</label>
                            <div className="password-input">
                                <input 
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Confirme a nova senha"
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                >
                                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="modal-button cancel" 
                                onClick={() => { 
                                    setIsPasswordModalOpen(false); 
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    setShowPasswords({ current: false, new: false, confirm: false });
                                }}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="modal-button confirm" 
                                onClick={handleChangePassword}
                                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            >
                                Alterar Senha
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para 2FA */}
            {isTwoFactorModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">
                            {securitySettings.twoFactorEnabled ? 'Desativar' : 'Ativar'} Autenticação de Dois Fatores
                        </h3>
                        <p className="modal-text">
                            {securitySettings.twoFactorEnabled 
                                ? 'Tem certeza que deseja desativar a autenticação de dois fatores? Isso tornará sua conta menos segura.'
                                : 'A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta.'
                            }
                        </p>
                        <div className="modal-actions">
                            <button 
                                className="modal-button cancel" 
                                onClick={() => setIsTwoFactorModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="modal-button confirm" 
                                onClick={() => {
                                    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
                                    setIsTwoFactorModalOpen(false);
                                    toast.success(securitySettings.twoFactorEnabled ? '2FA desativado' : '2FA ativado');
                                }}
                            >
                                {securitySettings.twoFactorEnabled ? 'Desativar' : 'Ativar'} 2FA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}