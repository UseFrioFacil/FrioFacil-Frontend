import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { API_URLS } from '../../../config/api';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';

const RegisterScreen: FC = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<'registration' | 'verification'>('registration');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        FullName: '',
        email: '',
        UserPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const validateForm = () => {
        const { FullName, email, UserPassword, confirmPassword } = formData;
        
        if (!FullName || !email || !UserPassword || !confirmPassword) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return false;
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Por favor, insira um email válido.');
            return false;
        }

        // Validação de senha
        if (UserPassword.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return false;
        }

        // Validação de confirmação de senha
        if (UserPassword !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(API_URLS.REGISTER, {
                FullName: formData.FullName,
                email: formData.email,
                UserPassword: formData.UserPassword,
            });
            
            toast.success(response.data.message || 'Cadastro realizado com sucesso!');
            
            // Pequeno delay para mostrar o toast antes de mudar para a etapa de verificação
            setTimeout(() => {
                setCurrentStep('verification');
            }, 1000);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Ocorreu um erro ao realizar o cadastro.');
            } else {
                toast.error('Não foi possível conectar ao servidor.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleResendEmail = () => {
        toast.info('E-mail de verificação reenviado!');
    };

    return (
        <div className="register-container">
            <LoadingSpinner isLoading={isLoading} />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

            <div className="register-wrapper">
                <div className="register-card">
                    {/* Left Panel (Branding) */}
                    <div className="branding-panel">
                        <div className="branding-content">
                            <div className="logo-container">
                                <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                                <h1 className="brand-name">FrioFacil</h1>
                            </div>
                            <p className="brand-description">A solução completa para suas necessidades de refrigeração.</p>
                        </div>
                    </div>

                    {/* Right Panel (Registration Form) */}
                    <div className="form-panel">
                        {/* Step 1: Registration Form */}
                        <div className={`step-transition ${currentStep === 'registration' ? 'step-active' : 'step-hidden'}`}>
                            <div className="form-header">
                                <h2 className="form-title">Crie sua conta</h2>
                                <p className="form-subtitle">É rápido e fácil. Vamos começar!</p>
                            </div>

                            <form className="register-form" onSubmit={handleSubmit}>
                                {/* Full Name Input */}
                                <div className="input-group">
                                    <label htmlFor="FullName" className="input-label">Nome Completo</label>
                                    <div className="input-wrapper">
                                        <div className="input-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="FullName" 
                                            className="form-input" 
                                            placeholder="Seu nome completo" 
                                            value={formData.FullName}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="input-group">
                                    <label htmlFor="email" className="input-label">E-mail</label>
                                    <div className="input-wrapper">
                                        <div className="input-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                        </div>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            className="form-input" 
                                            placeholder="voce@email.com" 
                                            value={formData.email}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="input-group">
                                    <label htmlFor="UserPassword" className="input-label">Senha</label>
                                    <div className="input-wrapper">
                                        <div className="input-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                <circle cx="12" cy="16" r="1"/>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                            </svg>
                                        </div>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            id="UserPassword" 
                                            className="form-input" 
                                            placeholder="Crie uma senha forte" 
                                            value={formData.UserPassword}
                                            onChange={handleChange}
                                            required 
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle" 
                                            onClick={() => togglePasswordVisibility('password')}
                                        >
                                            {showPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="input-group">
                                    <label htmlFor="confirmPassword" className="input-label">Confirmar Senha</label>
                                    <div className="input-wrapper">
                                        <div className="input-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                <circle cx="12" cy="16" r="1"/>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                            </svg>
                                        </div>
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            id="confirmPassword" 
                                            className="form-input" 
                                            placeholder="Repita a senha" 
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required 
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle" 
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                        >
                                            {showConfirmPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="submit-container">
                                    <button 
                                        type="submit" 
                                        className="submit-button" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Criando conta...' : 'Criar Conta'}
                                    </button>
                                </div>
                            </form>

                            {/* Login Link */}
                            <div className="login-link-container">
                                <p className="login-text">
                                    Já tem uma conta?
                                    <button 
                                        type="button"
                                        className="login-link" 
                                        onClick={() => !isLoading && navigate('/login')}
                                    >
                                        Faça login
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Verification Message */}
                        <div className={`step-transition ${currentStep === 'verification' ? 'step-active' : 'step-hidden'}`}>
                            <div className="verification-content">
                                <div className="verification-icon">
                                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                
                                <h2 className="verification-title">Verifique seu e-mail</h2>
                                <p className="verification-description">
                                    Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada e spam para ativar sua conta.
                                </p>
                                
                                <div className="verification-actions">
                                    <button 
                                        className="back-to-login-button"
                                        onClick={handleBackToLogin}
                                    >
                                        Voltar para o Login
                                    </button>
                                    
                                    <p className="resend-text">
                                        Não recebeu o e-mail?
                                        <button 
                                            type="button"
                                            className="resend-link" 
                                            onClick={handleResendEmail}
                                        >
                                            Reenviar
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;