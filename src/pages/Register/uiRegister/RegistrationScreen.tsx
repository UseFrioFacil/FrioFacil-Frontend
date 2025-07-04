import type { FC } from 'react';
import { useState } from 'react';
import { User, Mail, Phone, Lock, Home, MapPin, Building, ChevronsRight, Briefcase  } from 'lucide-react';
import FormInput from '../../../components/Form/FormInput'

const RegistrationScreen: FC = () => {
    const [clientType, setClientType] = useState<'individual' | 'company'>('individual');

    return (
        <div className="registration-container">
            <div className="registration-wrapper">
                <div className="registration-card">
                    <div className="registration-header">
                        <h1 className="registration-title">Crie sua Conta</h1>
                        <p className="registration-subtitle">Preencha os campos abaixo para começar a usar o FrioFácil.</p>
                    </div>
                    
                    <form className="registration-form">
                        {/* Seletor de Tipo de Cliente */}
                        <div className="client-type-selector">
                            <label className="client-type-label">Tipo de Cliente:</label>
                            <div className="client-type-options">
                                <button
                                    type="button"
                                    className={`client-type-button ${clientType === 'individual' ? 'active' : ''}`}
                                    onClick={() => setClientType('individual')}
                                >
                                    Pessoa Física
                                </button>
                                <button
                                    type="button"
                                    className={`client-type-button ${clientType === 'company' ? 'active' : ''}`}
                                    onClick={() => setClientType('company')}
                                >
                                    Pessoa Jurídica
                                </button>
                            </div>
                        </div>

                        {/* Seção de Dados do Cliente */}
                        <fieldset className="form-section">
                            <legend className="section-title">
                                {clientType === 'individual' ? 'Dados Pessoais' : 'Dados da Empresa'}
                            </legend>
                            <div className="form-grid">
                                {clientType === 'individual' ? (
                                    <>
                                        <FormInput icon={User} id="fullName" type="text" label="Nome Completo" placeholder="Seu nome completo" required />
                                        <FormInput icon={User} id="cpf" type="text" label="CPF" placeholder="000.000.000-00" required />
                                    </>
                                ) : (
                                    <>
                                        <FormInput icon={Briefcase} id="companyName" type="text" label="Razão Social" placeholder="Nome da empresa" required />
                                        <FormInput icon={Briefcase} id="tradeName" type="text" label="Nome Fantasia" placeholder="Nome fantasia da empresa" />
                                        <FormInput icon={Briefcase} id="cnpj" type="text" label="CNPJ" placeholder="00.000.000/0000-00" required />
                                        <FormInput icon={Briefcase} id="stateRegistration" type="text" label="Inscrição Estadual" placeholder="Inscrição estadual (se houver)" />
                                    </>
                                )}
                                <FormInput icon={Mail} id="email" type="email" label="E-mail" placeholder="voce@exemplo.com" required />
                                <FormInput icon={Phone} id="phone" type="tel" label="Telefone" placeholder="(00) 90000-0000" required />
                            </div>
                        </fieldset>

                        {/* Seção de Endereço */}
                        <fieldset className="form-section">
                            <legend className="section-title">Endereço</legend>
                            <div className="form-grid">
                                <div className="grid-col-span-1">
                                    <FormInput icon={MapPin} id="cep" type="text" label="CEP" placeholder="00000-000" required />
                                </div>
                                <div className="grid-col-span-2">
                                    <FormInput icon={Home} id="address" type="text" label="Endereço" placeholder="Sua rua, avenida, etc." required />
                                </div>
                                <FormInput icon={ChevronsRight} id="number" type="text" label="Número" placeholder="123" required />
                                <FormInput icon={Building} id="complement" type="text" label="Complemento" placeholder="Apto, bloco, etc." />
                                <FormInput icon={MapPin} id="neighborhood" type="text" label="Bairro" placeholder="Seu bairro" required />
                                <div className="grid-col-span-2">
                                    <FormInput icon={MapPin} id="city" type="text" label="Cidade" placeholder="Sua cidade" required />
                                </div>
                                <FormInput icon={MapPin} id="state" type="text" label="Estado" placeholder="UF" required />
                            </div>
                        </fieldset>

                        {/* Seção de Senha */}
                        <fieldset className="form-section">
                            <legend className="section-title">Segurança</legend>
                            <div className="form-grid">
                                <FormInput icon={Lock} id="password" type="password" label="Senha" placeholder="Crie uma senha forte" required />
                                <FormInput icon={Lock} id="confirmPassword" type="password" label="Confirmar Senha" placeholder="Repita a senha" required />
                            </div>
                        </fieldset>

                        <div className="submit-section">
                            <button type="submit" className="submit-button">
                                Cadastrar
                            </button>
                        </div>
                    </form>

                    <div className="login-redirect">
                        <p className="redirect-text">
                            Já tem uma conta? <a href="#" className="redirect-link">Faça login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationScreen