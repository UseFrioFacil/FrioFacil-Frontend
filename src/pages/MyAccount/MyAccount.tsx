import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    User, 
    AlertTriangle, 
    Shield,
    LogOut,
    Edit3,
    ShoppingBag,
    MapPin as LocationIcon,
    Cog,
    Headphones
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





// --- COMPONENTE PRINCIPAL ---
export default function MinhaContaPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error] = useState<string | null>(null);
    
    // Estados dos dados
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);



    // Dados mockados para demonstração
    useEffect(() => {
        const mockData = {
            userProfile: {
                cpf: '123.456.789-00',
                fullName: 'Maria Silva',
                phone: '(11) 99999-9999',
                email: 'maria.silva@email.com',
                memberSince: '2023-01-15',
                address: 'Rua das Flores, 123',
                city: 'São Paulo',
                state: 'SP'
            },
            subscriptions: [
                {
                    id: '1',
                    status: 'Ativo' as const,
                    planName: 'Plano Premium',
                    companyId: 'comp1',
                    tradeName: 'FrioFacil Premium',
                    nextBillingDate: '2024-02-15',
                    paymentMethod: 'Cartão de Crédito'
                }
            ],
            securitySettings: {
                twoFactorEnabled: false,
                lastPasswordChange: '2023-12-01',
                activeSessions: 1,
                loginHistory: [
                    {
                        date: '2024-01-15T10:30:00',
                        location: 'São Paulo, SP',
                        device: 'Chrome - Windows'
                    }
                ]
            }
        };

        setUserProfile(mockData.userProfile);
        setIsLoading(false);
    }, []);

    const handleLogout = () => {
        // Implementar lógica de logout
        navigate('/login');
        toast.success('Logout realizado com sucesso!');
    };

    const handleEditProfile = () => {
        navigate('/minhaconta/dados-pessoais');
    };

    const handleChangePassword = () => {
        navigate('/seguranca');
    };

    const handleViewOrders = () => {
        toast.info('Histórico de pedidos será implementado em breve!');
    };

    const handleManageAddresses = () => {
        toast.info('Gerenciamento de endereços será implementado em breve!');
    };

    const handleAccountSettings = () => {
        toast.info('Configurações da conta serão implementadas em breve!');
    };

    const handleSupportTickets = () => {
        toast.info('Sistema de tickets será implementado em breve!');
    };



    if (isLoading) {
        return <LoadingSpinner isLoading={true} />;
    }

    if (error) {
        return (
            <div className="error-container">
                <AlertTriangle size={48} className="error-icon" />
                <h2>Erro ao carregar dados</h2>
            <p>{error}</p>
                <button onClick={() => window.location.reload()}>Tentar Novamente</button>
        </div>
    );
    }

    return (
        <div className="minha-conta-container">
            <Header />
            
            <main className="main-content">
                <div className="content-wrapper">
                    <h1 className="page-title">Minha Conta</h1>

                    {/* Profile Overview Card */}
                    <div className="profile-overview-card">
                        <div className="profile-picture-section">
                            <div className="profile-picture-container">
                                <img 
                                    className="profile-picture" 
                                    src="https://placehold.co/128x128/E0E7FF/4F46E5?text=AV" 
                                    alt="Foto do Perfil" 
                                />
                                <button className="edit-picture-button">
                                    <Edit3 size={16} />
                                        </button>
                                    </div>
                                </div>
                        <div className="profile-info">
                            <h2 className="user-name">{userProfile?.fullName}</h2>
                            <p className="user-email">{userProfile?.email}</p>
                                    </div>
                                </div>

                    {/* Account Management Grid */}
                    <div className="account-grid">
                        
                        {/* Personal Data Card */}
                        <div className="account-card personal-data-card">
                            <div className="card-header">
                                <div className="card-icon personal-icon">
                                    <User size={24} />
                                                </div>
                                <h3 className="card-title">Dados Pessoais</h3>
                                                </div>
                            <p className="card-description">
                                Veja e edite suas informações pessoais, como nome, CPF e telefone.
                            </p>
                                            <button 
                                className="card-action-button"
                                onClick={handleEditProfile}
                            >
                                Gerenciar Dados →
                                            </button>
                                </div>

                        {/* Security Card */}
                        <div className="account-card security-card">
                            <div className="card-header">
                                <div className="card-icon security-icon">
                                    <Shield size={24} />
                                                        </div>
                                <h3 className="card-title">Segurança</h3>
                                                    </div>
                            <p className="card-description">
                                Altere sua senha e gerencie as configurações de segurança da sua conta.
                            </p>
                            <button 
                                className="card-action-button"
                                onClick={handleChangePassword}
                            >
                                Alterar Senha →
                            </button>
                        </div>

                        {/* My Orders Card */}
                        <div className="account-card orders-card">
                            <div className="card-header">
                                <div className="card-icon orders-icon">
                                    <ShoppingBag size={24} />
                    </div>
                                <h3 className="card-title">Meus Pedidos</h3>
                </div>
                            <p className="card-description">
                                Acompanhe seus pedidos, veja o histórico e gerencie devoluções.
                            </p>
                            <button 
                                className="card-action-button"
                                onClick={handleViewOrders}
                            >
                                Ver Histórico →
                            </button>
                        </div>
                        
                        {/* Saved Addresses Card */}
                        <div className="account-card addresses-card">
                            <div className="card-header">
                                <div className="card-icon addresses-icon">
                                    <LocationIcon size={24} />
                        </div>
                                <h3 className="card-title">Endereços</h3>
                        </div>
                            <p className="card-description">
                                Adicione, edite ou remova seus endereços de entrega e faturamento.
                            </p>
                            <button 
                                className="card-action-button"
                                onClick={handleManageAddresses}
                            >
                                Gerenciar Endereços →
                            </button>
                        </div>

                        {/* Account Settings Card */}
                        <div className="account-card settings-card">
                            <div className="card-header">
                                <div className="card-icon settings-icon">
                                    <Cog size={24} />
                            </div>
                                <h3 className="card-title">Configurações da Conta</h3>
                        </div>
                            <p className="card-description">
                                Gerencie preferências de notificação, idioma e temas da sua conta.
                            </p>
                                <button 
                                className="card-action-button"
                                onClick={handleAccountSettings}
                                >
                                Ajustar Preferências →
                                </button>
                            </div>

                        {/* Support Tickets Card */}
                        <div className="account-card support-card">
                            <div className="card-header">
                                <div className="card-icon support-icon">
                                    <Headphones size={24} />
                        </div>
                                <h3 className="card-title">Tickets de Suporte</h3>
                            </div>
                            <p className="card-description">
                                Precisa de ajuda? Abra um chamado ou acompanhe o status dos seus tickets.
                            </p>
                            <button 
                                className="card-action-button"
                                onClick={handleSupportTickets}
                            >
                                Abrir um chamado →
                            </button>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="logout-section">
                            <button 
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                            Sair da Conta
                            </button>
                        </div>
                    </div>
            </main>


        </div>
    );
}