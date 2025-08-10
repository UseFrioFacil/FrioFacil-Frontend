import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    User, 
    AlertTriangle, 
    Shield,
    Trash2,
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
        // Carregar dados imediatamente sem delay artificial
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
            }
        };

        setUserProfile(mockData.userProfile);
        setIsLoading(false);
    }, []);

    const handleDeleteAccount = () => {
        // Implementar lógica de deletar conta
        if (window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
            toast.success('Conta deletada com sucesso!');
            navigate('/login');
        }
    };

    const handleEditProfile = () => {
        navigate('/minhaconta/dados-pessoais');
    };

    const handleChangePassword = () => {
        navigate('/seguranca');
    };

    const handleViewSubscriptions = () => {
        navigate('/minhaconta/assinaturas');
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
                <button onClick={() => window.location.reload()}>
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="minha-conta-container">
            <Header showOptions={false} showMenu={false} showBackButton={true} />
            
            <main className="main-content">
                <div className="content-wrapper">
                    <h1 className="page-title">Minha Conta</h1>

                    {/* Card de visão geral do perfil */}
                    <div className="profile-overview-card">
                        <div className="profile-picture-section">
                            <div className="profile-picture-container">
                                <img 
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                                    alt="Foto de perfil" 
                                    className="profile-picture"
                                />
                                <button className="edit-picture-button">
                                    <Edit3 size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="profile-info">
                            <h2 className="user-name">{userProfile?.fullName}</h2>
                            <p className="user-email">{userProfile?.email}</p>
                        </div>
                    </div>

                    {/* Grid de opções da conta */}
                    <div className="account-grid">
                        {/* Dados Pessoais */}
                        <div className="account-card" onClick={handleEditProfile}>
                            <div className="card-header">
                                <div className="card-icon personal-icon">
                                    <User size={24} />
                                </div>
                            </div>
                            <h3 className="card-title">Dados Pessoais</h3>
                            <p className="card-description">Gerencie suas informações pessoais</p>
                            <button className="card-action-button">
                                Editar Dados
                            </button>
                        </div>

                        {/* Segurança */}
                        <div className="account-card" onClick={handleChangePassword}>
                            <div className="card-header">
                                <div className="card-icon security-icon">
                                    <Shield size={24} />
                                </div>
                            </div>
                            <h3 className="card-title">Segurança</h3>
                            <p className="card-description">Altere sua senha e configurações de segurança</p>
                            <button className="card-action-button">
                                Alterar Senha
                            </button>
                        </div>

                        {/* Minhas Assinaturas */}
                        <div className="account-card" onClick={handleViewSubscriptions}>
                            <div className="card-header">
                                <div className="card-icon orders-icon">
                                    <ShoppingBag size={24} />
                                </div>
                            </div>
                            <h3 className="card-title">Minhas Assinaturas</h3>
                            <p className="card-description">Gerencie seu plano e veja histórico de pagamentos</p>
                            <button className="card-action-button">
                                Ver Assinaturas
                            </button>
                        </div>

                        {/* Endereços */}
                        <div className="account-card" onClick={handleManageAddresses}>
                            <div className="card-header">
                                <div className="card-icon addresses-icon">
                                    <LocationIcon size={24} />
                                </div>
                            </div>
                            <h3 className="card-title">Endereços</h3>
                            <p className="card-description">Gerencie seus endereços de entrega</p>
                            <button className="card-action-button">
                                Gerenciar
                            </button>
                        </div>

                        {/* Configurações da Conta */}
                        <div className="account-card" onClick={handleAccountSettings}>
                            <div className="card-header">
                                <div className="card-icon settings-icon">
                                    <Cog size={24} />
                                </div>
                            </div>
                            <h3 className="card-title">Configurações</h3>
                            <p className="card-description">Preferências e configurações da conta</p>
                            <button className="card-action-button">
                                Configurar
                            </button>
                        </div>

                        {/* Suporte */}
                        <div className="account-card" onClick={handleSupportTickets}>
                            <div className="card-header">
                                <div className="card-icon support-icon">
                                    <Headphones size={24} />
                                </div>
                            </div>
                            <h3 className="card-title">Suporte</h3>
                            <p className="card-description">Entre em contato com nosso suporte</p>
                            <button className="card-action-button">
                                Contatar
                            </button>
                        </div>
                    </div>

                    {/* Card de deletar conta */}
                    <div className="delete-account-card">
                        <div className="card-header">
                            <div className="card-icon delete-icon">
                                <Trash2 size={24} />
                            </div>
                        </div>
                        <h3 className="card-title">Deletar Conta</h3>
                        <p className="card-description">Exclua permanentemente sua conta e todos os dados</p>
                        <button className="card-action-button delete-button" onClick={handleDeleteAccount}>
                            Deletar Conta
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}