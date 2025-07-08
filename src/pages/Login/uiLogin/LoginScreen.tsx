import type { FC } from 'react';
import { Mail, Lock } from 'lucide-react';
import FormInput from '../../../components/Form/FormInput';
import { useNavigate } from 'react-router-dom';


const LoginScreen: FC = () => {
    const navigate = useNavigate()

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">Acesse sua Conta</h1>
                        <p className="login-subtitle">Bem-vindo de volta! Insira seus dados.</p>
                    </div>
                    
                    <form className="login-form">
                        <FormInput icon={Mail} id="email" type="email" label="E-mail" placeholder="voce@exemplo.com" />
                        <FormInput icon={Lock} id="password" type="password" label="Senha" placeholder="Sua senha" />

                        <div className="form-options">
                            <div className="remember-me">
                                <input id="remember-me" name="remember-me" type="checkbox" className="checkbox" />
                                <label htmlFor="remember-me" className="remember-label">
                                    Lembrar-me
                                </label>
                            </div>

                            <div className="forgot-password">
                                <a href="#" className="forgot-link">
                                    Esqueceu a senha?
                                </a>
                            </div>
                        </div>

                        <div className="submit-button-container">
                            <button type="submit" className="submit-button" onClick={() => navigate('/home')}>
                                Entrar
                            </button>
                        </div>
                    </form>

                    <div className="signup-link-container">
                        <p className="signup-text">
                            Não tem uma conta? <a onClick={() => navigate("/cadastro")} className="signup-link">Cadastre-se</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen