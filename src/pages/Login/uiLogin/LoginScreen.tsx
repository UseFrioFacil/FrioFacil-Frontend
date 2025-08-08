import { useState } from 'react';
import type {FC, FormEvent} from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URLS } from '../../../config/api';
import 'react-toastify/dist/ReactToastify.css';
import FormInput from '../../../components/Form/FormInput';
import PasswordInput from '../../../components/Form/PasswordInput';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';

const LoginScreen: FC = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

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
                    <div className="login-header">
                        <h1 className="login-title">Acesse sua Conta</h1>
                        <p className="login-subtitle">Bem-vindo de volta! Insira seus dados.</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <FormInput
                            icon={Mail}
                            id="email"
                            type="email"
                            label="E-mail"
                            placeholder="voce@exemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            required={true}
                        />
                        
                        <PasswordInput
                            id="userpassword"
                            label="Senha"
                            placeholder="Sua senha"
                            value={formData.userpassword}
                            onChange={handleChange}
                            required={true}
                        />

                        <div className="form-options">
                            <div className="remember-me">
                                <input id="remember-me" name="remember-me" type="checkbox" className="checkbox" />
                                <label htmlFor="remember-me" className="remember-label">
                                    Lembrar-me
                                </label>
                            </div>
                            <div className="forgot-password">
                                <button 
                                    type="button"
                                    className="forgot-link" 
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
                        </div>

                        <div className="submit-button-container">
                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>

                    <div className="signup-link-container">
                        <p className="signup-text">
                            Não tem uma conta? <a onClick={() => !isLoading && navigate("/cadastro")} className="signup-link">Cadastre-se</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;