import { useState } from 'react';
import type {FC, FormEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URLS } from '../../../config/api';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';

const LoginScreen: FC = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        userpassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.userpassword) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Por favor, insira um email válido.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(API_URLS.LOGIN, formData);
            toast.success(response.data.message || 'Login realizado com sucesso!');
            localStorage.setItem("accessToken", response.data.token);
            navigate('/home');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Credenciais inválidas. Tente novamente.');
            } else {
                toast.error('Não foi possível conectar ao servidor.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <LoadingSpinner isLoading={isLoading} />

            <div className="login-wrapper">
                <div className="login-card">
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

                    {/* Right Panel (Login Form) */}
                    <div className="form-panel">
                        <div className="form-header">
                            <h2 className="form-title">Bem-vindo de volta!</h2>
                            <p className="form-subtitle">Faça login para acessar sua conta.</p>
                        </div>

                        <form className="login-form" onSubmit={handleSubmit}>
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
                                <label htmlFor="userpassword" className="input-label">Senha</label>
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
                                        id="userpassword" 
                                        className="form-input" 
                                        placeholder="Sua senha" 
                                        value={formData.userpassword}
                                        onChange={handleChange}
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={togglePasswordVisibility}
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

                            {/* Remember me & Forgot password */}
                            <div className="form-options">
                                <div className="remember-me">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="checkbox" />
                                    <label htmlFor="remember-me" className="remember-label">
                                        Lembrar de mim
                                    </label>
                                </div>
                                <div className="forgot-password">
                                    <button 
                                        type="button"
                                        className="forgot-link" 
                                        onClick={() => navigate('/forgot-password')}
                                    >
                                        Esqueceu sua senha?
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
                                    {isLoading ? 'Entrando...' : 'Entrar'}
                                </button>
                            </div>
                        </form>

                        {/* Social Login Separator */}
                        <div className="social-separator">
                            <div className="separator-line"></div>
                            <span className="separator-text">Ou continue com</span>
                            <div className="separator-line"></div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="social-buttons">
                            <button className="social-button">
                                <svg className="social-icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.14 6.839 9.491.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                </svg>
                                <span>Entrar com Google</span>
                            </button>
                        </div>
                        
                        {/* Sign Up Link */}
                        <div className="signup-container">
                            <p className="signup-text">
                                Não tem uma conta?
                                <button 
                                    type="button"
                                    className="signup-link" 
                                    onClick={() => !isLoading && navigate("/cadastro")}
                                >
                                    Cadastre-se
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;