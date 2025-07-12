import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Mail, Lock, User, FileText, Phone } from 'lucide-react';
import FormInput from '../../../components/Form/FormInput';
import { useNavigate } from 'react-router-dom';

const TelaDeCadastro: FC = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        senha: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Dados do formulário de cadastro:', formData);
        alert('Cadastro realizado com sucesso! (Verifique o console)');
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Crie sua Conta</h1>
                        <p className="auth-subtitle">Preencha seus dados para começar.</p>
                    </div>
                    
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <FormInput icon={User} id="nome" type="text" label="Nome Completo" placeholder="Seu nome completo" value={formData.nome} onChange={handleChange} />
                        <FormInput icon={FileText} id="cpf" type="text" label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange}/>
                        <FormInput icon={Phone} id="telefone" type="tel" label="Telefone (Opcional)" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange}/>
                        <FormInput icon={Mail} id="email" type="email" label="E-mail" placeholder="voce@exemplo.com" value={formData.email} onChange={handleChange}/>
                        <FormInput icon={Lock} id="senha" type="password" label="Senha" placeholder="Crie uma senha forte" value={formData.senha} onChange={handleChange}/>

                        <div className="submit-button-container">
                            <button type="submit" className="submit-button">
                                Cadastrar
                            </button>
                        </div>
                    </form>

                    <div className="switch-link-container">
                        <p className="switch-text">
                            Já tem uma conta? <a onClick={() => navigate('/login')} className="switch-link">Faça login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelaDeCadastro