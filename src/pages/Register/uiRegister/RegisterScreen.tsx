import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Mail, Lock, User, FileText, Phone } from 'lucide-react';
import FormInput from '../../../components/Form/FormInput';
import { API_URLS } from '../../../config/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// O ToastContainer é necessário para as notificações aparecerem
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// 1. Importe o componente de Loading
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';

const TelaDeCadastro: FC = () => {
    const navigate = useNavigate();

    // 2. Crie um estado para controlar o loading
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        FullName: '',
        cpf: '',
        Phone: '',
        email: '',
        UserPassword: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const { FullName, cpf, email, UserPassword, Phone } = formData;
        if (!FullName || !cpf || !email || !UserPassword || !Phone) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // 3. Ative o loading antes da requisição
        setIsLoading(true);

        try {
            const response = await axios.post(API_URLS.REGISTER, formData);
            toast.success(response.data.message || 'Cadastro realizado com sucesso!');
            localStorage.setItem("accessToken", response.data.token)
            navigate('/home');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Ocorreu um erro ao realizar o cadastro.');
            } else {
                toast.error('Não foi possível conectar ao servidor.');
            }
        } finally {
            // 4. Desative o loading no final, independentemente do resultado
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* 5. Renderize os componentes de Loading e Toast */}
            <LoadingSpinner isLoading={isLoading} />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Crie sua Conta</h1>
                        <p className="auth-subtitle">Preencha seus dados para começar.</p>
                    </div>
                    
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <FormInput icon={User} id="FullName" type="text" label="Nome Completo" placeholder="Seu nome completo" value={formData.FullName} onChange={handleChange} required/>
                        <FormInput icon={FileText} id="cpf" type="text" label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required/>
                        <FormInput icon={Phone} id="Phone" type="tel" label="Telefone" placeholder="(00) 00000-0000" value={formData.Phone} onChange={handleChange} required/>
                        <FormInput icon={Mail} id="email" type="email" label="E-mail" placeholder="voce@exemplo.com" value={formData.email} onChange={handleChange} required/>
                        <FormInput icon={Lock} id="UserPassword" type="password" label="Senha" placeholder="Crie uma senha forte" value={formData.UserPassword} onChange={handleChange} required/>

                        <div className="submit-button-container">
                             {/* 6. Atualize o botão para refletir o estado de loading */}
                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </div>
                    </form>

                    <div className="switch-link-container">
                        <p className="switch-text">
                            Já tem uma conta? <a onClick={() => !isLoading && navigate('/login')} className="switch-link">Faça login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelaDeCadastro;