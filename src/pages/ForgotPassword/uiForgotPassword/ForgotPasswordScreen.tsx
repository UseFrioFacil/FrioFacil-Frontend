import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormInput from '../../../components/Form/FormInput';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';

type Step = 'email' | 'code' | 'newPassword' | 'success';

const ForgotPasswordScreen: FC = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Por favor, insira seu email.');
            return;
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Por favor, insira um email válido.');
            return;
        }

        setIsLoading(true);

        try {
            // Simular envio de código de verificação
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.success('Código de verificação enviado para seu email!');
            setCurrentStep('code');
        } catch (error) {
            toast.error('Erro ao enviar código de verificação. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!verificationCode) {
            toast.error('Por favor, insira o código de verificação.');
            return;
        }

        if (verificationCode.length !== 6) {
            toast.error('O código deve ter 6 dígitos.');
            return;
        }

        setIsLoading(true);

        try {
            // Simular verificação do código
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success('Código verificado com sucesso!');
            setCurrentStep('newPassword');
        } catch (error) {
            toast.error('Código inválido. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        setIsLoading(true);

        try {
            // Simular alteração de senha
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.success('Senha alterada com sucesso!');
            setCurrentStep('success');
        } catch (error) {
            toast.error('Erro ao alterar senha. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleResendCode = async () => {
        if (!email) {
            toast.error('Email não encontrado.');
            return;
        }

        setIsLoading(true);

        try {
            // Simular reenvio de código
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success('Novo código enviado para seu email!');
        } catch (error) {
            toast.error('Erro ao reenviar código. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="step-indicator">
            <div className={`step ${currentStep === 'email' ? 'active' : ['code', 'newPassword', 'success'].includes(currentStep) ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <span>Email</span>
            </div>
            <div className={`step ${currentStep === 'code' ? 'active' : ['newPassword', 'success'].includes(currentStep) ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <span>Código</span>
            </div>
            <div className={`step ${currentStep === 'newPassword' ? 'active' : currentStep === 'success' ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <span>Nova Senha</span>
            </div>
        </div>
    );

    const renderEmailStep = () => (
        <form className="forgot-form" onSubmit={handleEmailSubmit}>
            <div className="form-header">
                <h1 className="form-title">Esqueceu sua senha?</h1>
                <p className="form-subtitle">
                    Não se preocupe! Digite seu email e enviaremos um código de verificação para você redefinir sua senha.
                </p>
            </div>

            <FormInput
                icon={Mail}
                id="email"
                type="email"
                label="E-mail"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
            />

            <div className="submit-button-container">
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar Código'}
                </button>
            </div>

            <div className="back-link-container">
                <button type="button" className="back-link" onClick={handleBackToLogin}>
                    <ArrowLeft size={16} />
                    Voltar para o login
                </button>
            </div>
        </form>
    );

    const renderCodeStep = () => (
        <form className="forgot-form" onSubmit={handleCodeSubmit}>
            <div className="form-header">
                <h1 className="form-title">Verificação</h1>
                <p className="form-subtitle">
                    Enviamos um código de 6 dígitos para <strong>{email}</strong>
                </p>
            </div>

            <div className="form-input-container">
                <label htmlFor="verificationCode" className="form-label">
                    Código de Verificação <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                    <input 
                        type="text"
                        id="verificationCode"
                        className="form-input code-input"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        required={true}
                    />
                </div>
            </div>

            <div className="submit-button-container">
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Verificando...' : 'Verificar Código'}
                </button>
            </div>

            <div className="resend-container">
                <p className="resend-text">Não recebeu o código?</p>
                <button 
                    type="button" 
                    className="resend-link" 
                    onClick={handleResendCode}
                    disabled={isLoading}
                >
                    Reenviar código
                </button>
            </div>

            <div className="back-link-container">
                <button type="button" className="back-link" onClick={() => setCurrentStep('email')}>
                    <ArrowLeft size={16} />
                    Voltar
                </button>
            </div>
        </form>
    );

    const renderNewPasswordStep = () => (
        <form className="forgot-form" onSubmit={handlePasswordSubmit}>
            <div className="form-header">
                <h1 className="form-title">Nova Senha</h1>
                <p className="form-subtitle">
                    Digite sua nova senha
                </p>
            </div>

            <div className="form-input-container">
                <label htmlFor="newPassword" className="form-label">
                    Nova Senha <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                    <div className="input-icon">
                        <Mail size={20} />
                    </div>
                    <input 
                        type="password"
                        id="newPassword"
                        className="form-input"
                        placeholder="Digite sua nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required={true}
                    />
                </div>
            </div>

            <div className="form-input-container">
                <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Nova Senha <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                    <div className="input-icon">
                        <Mail size={20} />
                    </div>
                    <input 
                        type="password"
                        id="confirmPassword"
                        className="form-input"
                        placeholder="Confirme sua nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={true}
                    />
                </div>
            </div>

            <div className="password-requirements">
                <p className="requirements-title">Sua senha deve conter:</p>
                <ul className="requirements-list">
                    <li className={newPassword.length >= 8 ? 'valid' : ''}>
                        Pelo menos 8 caracteres
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'valid' : ''}>
                        Uma letra maiúscula
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'valid' : ''}>
                        Uma letra minúscula
                    </li>
                    <li className={/\d/.test(newPassword) ? 'valid' : ''}>
                        Um número
                    </li>
                </ul>
            </div>

            <div className="submit-button-container">
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Alterando...' : 'Alterar Senha'}
                </button>
            </div>

            <div className="back-link-container">
                <button type="button" className="back-link" onClick={() => setCurrentStep('code')}>
                    <ArrowLeft size={16} />
                    Voltar
                </button>
            </div>
        </form>
    );

    const renderSuccessStep = () => (
        <div className="success-container">
            <div className="success-icon">
                <CheckCircle size={64} />
            </div>
            <div className="success-content">
                <h1 className="success-title">Senha Alterada!</h1>
                <p className="success-subtitle">
                    Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
                </p>
            </div>
            <div className="submit-button-container">
                <button 
                    type="button" 
                    className="submit-button" 
                    onClick={handleBackToLogin}
                >
                    Ir para o Login
                </button>
            </div>
        </div>
    );

    return (
        <div className="forgot-container">
            <LoadingSpinner isLoading={isLoading} />

            <div className="forgot-wrapper">
                <div className="forgot-card">
                    {renderStepIndicator()}
                    
                    {currentStep === 'email' && renderEmailStep()}
                    {currentStep === 'code' && renderCodeStep()}
                    {currentStep === 'newPassword' && renderNewPasswordStep()}
                    {currentStep === 'success' && renderSuccessStep()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
