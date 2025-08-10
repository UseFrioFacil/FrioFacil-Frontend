import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    ArrowLeft,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    Monitor,
    Smartphone,
    Laptop,
    Shield,
    Bell,
    Smartphone as DeviceIcon
} from 'lucide-react';
import './SecurityStyle.css';
import Header from '../../../components/Header/Header.tsx';

// --- INTERFACES DE DADOS ---
interface LoginHistory {
    id: string;
    device: string;
    deviceIcon: string;
    location: string;
    ip: string;
    date: string;
    isCurrent: boolean;
}

interface PasswordRequirements {
    length: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
}

interface PasswordStrength {
    score: number;
    text: string;
    color: string;
    width: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function SecurityPage() {
    const navigate = useNavigate();

    // Estados dos formulários
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

    // Estados de configuração
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [loginNotifications, setLoginNotifications] = useState(true);

    // Estados de validação
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
        length: false,
        uppercase: false,
        number: false,
        special: false
    });

    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
        score: 0,
        text: '',
        color: '',
        width: '0%'
    });

    // Dados mockados
    const [loginHistory] = useState<LoginHistory[]>([
        {
            id: '1',
            device: 'Chrome no Windows',
            deviceIcon: 'Monitor',
            location: 'São Paulo, SP',
            ip: '200.200.200.200',
            date: 'Hoje, 11:11',
            isCurrent: true
        },
        {
            id: '2',
            device: 'App FrioFacil no iPhone 14',
            deviceIcon: 'Smartphone',
            location: 'Rio de Janeiro, RJ',
            ip: '187.187.187.187',
            date: 'Ontem, 20:34',
            isCurrent: false
        },
        {
            id: '3',
            device: 'Firefox no MacOS',
            deviceIcon: 'Laptop',
            location: 'Belo Horizonte, MG',
            ip: '177.177.177.177',
            date: '07/08/2025',
            isCurrent: false
        }
    ]);

    // Função para validar senha
    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        setPasswordRequirements(requirements);

        const score = Object.values(requirements).filter(Boolean).length;
        let strength: PasswordStrength;

        switch (score) {
            case 0:
            case 1:
                strength = {
                    score,
                    text: 'Senha Fraca',
                    color: 'red',
                    width: '25%'
                };
                break;
            case 2:
                strength = {
                    score,
                    text: 'Senha Média',
                    color: 'yellow',
                    width: '50%'
                };
                break;
            case 3:
                strength = {
                    score,
                    text: 'Senha Boa',
                    color: 'blue',
                    width: '75%'
                };
                break;
            case 4:
                strength = {
                    score,
                    text: 'Senha Forte',
                    color: 'green',
                    width: '100%'
                };
                break;
            default:
                strength = {
                    score: 0,
                    text: '',
                    color: '',
                    width: '0%'
                };
        }

        if (password.length === 0) {
            strength = {
                score: 0,
                text: '',
                color: '',
                width: '0%'
            };
        }

        setPasswordStrength(strength);
    };

    // Função para alternar visibilidade da senha
    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Função para obter ícone do dispositivo
    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'Monitor':
                return <Monitor size={24} />;
            case 'Smartphone':
                return <Smartphone size={24} />;
            case 'Laptop':
                return <Laptop size={24} />;
            default:
                return <DeviceIcon size={24} />;
        }
    };

    // Função para alterar senha
    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('As senhas não coincidem!');
            return;
        }

        if (passwordStrength.score < 3) {
            toast.error('A senha deve atender aos requisitos mínimos de segurança!');
            return;
        }

        // Simular alteração de senha
        toast.success('Senha alterada com sucesso!');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordStrength({
            score: 0,
            text: '',
            color: '',
            width: '0%'
        });
    };

    // Função para ativar/desativar 2FA
    const handleToggleTwoFactor = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        toast.success(twoFactorEnabled ? '2FA desativado' : '2FA ativado');
    };

    // Função para gerenciar dispositivos
    const handleManageDevices = () => {
        toast.info('Funcionalidade de gerenciamento de dispositivos será implementada em breve!');
    };

    // Função para voltar
    const handleGoBack = () => {
        navigate('/minhaconta');
    };

    // Atualizar validação da senha quando ela mudar
    useEffect(() => {
        validatePassword(passwordData.newPassword);
    }, [passwordData.newPassword]);

    return (
        <div className="security-container">
            <Header />
            
            <main className="main-content">
                <div className="content-wrapper">
                    {/* Back Link */}
                    <div className="back-link-section">
                        <button 
                            onClick={handleGoBack}
                            className="back-link"
                        >
                            <ArrowLeft size={16} />
                            Voltar para Minha Conta
                        </button>
                    </div>

                    <h1 className="page-title">Segurança</h1>

                    {/* Grid Layout */}
                    <div className="security-grid">
                        
                        {/* Left Column */}
                        <div className="left-column">
                            
                            {/* Change Password Card */}
                            <div className="security-card">
                                <h3 className="card-title">Alterar Senha</h3>
                                <form onSubmit={handleChangePassword} className="password-form">
                                    <div className="form-group">
                                        <label htmlFor="current-password">Senha Atual</label>
                                        <div className="password-input-container">
                                            <input 
                                                type={showPasswords.current ? "text" : "password"}
                                                id="current-password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                placeholder="Digite sua senha atual"
                                                required
                                            />
                                            <button 
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => togglePasswordVisibility('current')}
                                            >
                                                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="new-password">Nova Senha</label>
                                        <div className="password-input-container">
                                            <input 
                                                type={showPasswords.new ? "text" : "password"}
                                                id="new-password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                placeholder="Digite a nova senha"
                                                required
                                            />
                                            <button 
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => togglePasswordVisibility('new')}
                                            >
                                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password Strength Bar */}
                                    {passwordData.newPassword && (
                                        <div className="password-strength">
                                            <div className="strength-bar-container">
                                                <div 
                                                    className={`strength-bar strength-${passwordStrength.color}`}
                                                    style={{ width: passwordStrength.width }}
                                                ></div>
                                            </div>
                                            {passwordStrength.text && (
                                                <p className={`strength-text strength-${passwordStrength.color}`}>
                                                    {passwordStrength.text}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Password Requirements */}
                                    <div className="password-requirements">
                                        <p className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
                                            {passwordRequirements.length ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                            Mínimo de 8 caracteres
                                        </p>
                                        <p className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
                                            {passwordRequirements.uppercase ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                            Pelo menos uma letra maiúscula
                                        </p>
                                        <p className={`requirement ${passwordRequirements.number ? 'met' : ''}`}>
                                            {passwordRequirements.number ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                            Pelo menos um número
                                        </p>
                                        <p className={`requirement ${passwordRequirements.special ? 'met' : ''}`}>
                                            {passwordRequirements.special ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                            Pelo menos um caractere especial (!@#$...)
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirm-password">Confirmar Nova Senha</label>
                                        <div className="password-input-container">
                                            <input 
                                                type={showPasswords.confirm ? "text" : "password"}
                                                id="confirm-password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                placeholder="Confirme a nova senha"
                                                required
                                            />
                                            <button 
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => togglePasswordVisibility('confirm')}
                                            >
                                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" className="forgot-password-link">
                                            Esqueceu sua senha?
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="save-password-button"
                                            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordStrength.score < 3}
                                        >
                                            Salvar Nova Senha
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Login History */}
                            <div className="security-card">
                                <h3 className="card-title">Histórico de Atividades e Login</h3>
                                <div className="login-history">
                                    {loginHistory.map((login) => (
                                        <div key={login.id} className="login-item">
                                            <div className="login-info">
                                                <div className="device-icon">
                                                    {getDeviceIcon(login.deviceIcon)}
                                                </div>
                                                <div className="device-details">
                                                    <p className="device-name">{login.device}</p>
                                                    <p className="device-location">{login.location} (IP: {login.ip})</p>
                                                </div>
                                            </div>
                                            <span className="login-date">{login.date}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="view-all-link">
                                    <button type="button">Ver todo o histórico</button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="right-column">
                            
                            {/* Two-Factor Authentication Card */}
                            <div className="security-card">
                                <h3 className="card-title">Autenticação de Dois Fatores</h3>
                                <p className="card-description">
                                    Aumente a segurança da sua conta exigindo um código de verificação ao fazer login.
                                </p>
                                <div className="status-container">
                                    <div className="status-info">
                                        <p className="status-label">Status</p>
                                        <span className={`status-value ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                                            {twoFactorEnabled ? 'Ativado' : 'Desativado'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={handleToggleTwoFactor}
                                        className={`toggle-button ${twoFactorEnabled ? 'deactivate' : 'activate'}`}
                                    >
                                        {twoFactorEnabled ? 'Desativar' : 'Ativar'}
                                    </button>
                                </div>
                            </div>

                            {/* Login Notifications Card */}
                            <div className="security-card">
                                <h3 className="card-title">Notificações de Segurança</h3>
                                <p className="card-description">
                                    Receba um alerta por e-mail ou push sempre que houver um login em um novo dispositivo.
                                </p>
                                <div className="notification-container">
                                    <p className="notification-label">Alertas de novo login</p>
                                    <label className="toggle-switch">
                                        <input 
                                            type="checkbox"
                                            checked={loginNotifications}
                                            onChange={(e) => setLoginNotifications(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            {/* Connected Devices Card */}
                            <div className="security-card">
                                <h3 className="card-title">Dispositivos Conectados</h3>
                                <p className="card-description">
                                    Gerencie as sessões ativas em todos os seus dispositivos.
                                </p>
                                <button 
                                    onClick={handleManageDevices}
                                    className="manage-devices-button"
                                >
                                    Gerenciar Dispositivos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
