import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, Home, MapPin, Building, ChevronsRight, Briefcase
} from 'lucide-react';
import FormInput from '../../../components/Form/FormInput';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';

const RegistrationScreen: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [clientType, setClientType] = useState<'individual' | 'company'>('individual');
    const accessToken = localStorage.getItem("accessToken");

    const [formData, setFormData] = useState({
        fullName: '',
        cpf: '',
        legalname: '',
        tradename: '',
        cnpj: '',
        stateregistration: '',
        email: '',
        phone: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5103/api/friofacil/createtempcompany', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const tokenTempCompany = response.data.tempCompanyId; 
            
            toast.success("Dados validados com sucesso! Você será redirecionado.");
            
            navigate('/checkout', { 
                state: { tokenTempCompany: tokenTempCompany } 
            });

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ocorreu um erro. Tente novamente.";
            toast.error(errorMessage);
        
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <LoadingSpinner isLoading={isLoading} />

            <div className="registration-wrapper">
                <div className="registration-card">
                    <div className="registration-header">
                        <h1 className="registration-title">Cadastre sua Empresa</h1>
                        <p className="registration-subtitle">Preencha os campos abaixo para começar a usar o FrioFácil.</p>
                    </div>

                    <form className="registration-form" onSubmit={handleSubmit}>
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
                                {clientType === 'individual' ? 'Dados do Cadastro' : 'Dados da Empresa'}
                            </legend>
                            <div className="form-grid">
                                {clientType === 'individual' ? (
                                    <>
                                        <FormInput icon={Briefcase} id="tradename" type="text" label="Nome Fantasia" placeholder="Ex: Serviços do João" value={formData.tradename} onChange={handleChange} required />
                                        <FormInput icon={User} id="fullName" type="text" label="Nome Completo" placeholder="Seu nome completo" value={formData.fullName} onChange={handleChange} required />
                                        <FormInput icon={User} id="cpf" type="text" label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required />
                                    </>
                                ) : (
                                    <>
                                        <FormInput icon={Briefcase} id="legalname" type="text" label="Razão Social" placeholder="Nome da empresa" value={formData.legalname} onChange={handleChange} required />
                                        <FormInput icon={Briefcase} id="tradename" type="text" label="Nome Fantasia" placeholder="Nome fantasia da empresa" value={formData.tradename} onChange={handleChange} required />
                                        <FormInput icon={Briefcase} id="cnpj" type="text" label="CNPJ" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={handleChange} required />
                                        <FormInput icon={Briefcase} id="stateregistration" type="text" label="Inscrição Estadual" placeholder="Inscrição estadual (se houver)" value={formData.stateregistration} onChange={handleChange} />
                                    </>
                                )}
                                <FormInput icon={Mail} id="email" type="email" label="E-mail" placeholder="voce@exemplo.com" value={formData.email} onChange={handleChange} required />
                                <FormInput icon={Phone} id="phone" type="tel" label="Telefone" placeholder="(00) 90000-0000" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </fieldset>

                        {/* Seção de Endereço */}
                        <fieldset className="form-section">
                            <legend className="section-title">Endereço</legend>
                            <div className="form-grid">
                                <div className="grid-col-span-1">
                                    <FormInput icon={MapPin} id="cep" type="text" label="CEP" placeholder="00000-000" value={formData.cep} onChange={handleChange} required />
                                </div>
                                <div className="grid-col-span-2">
                                    <FormInput icon={Home} id="address" type="text" label="Endereço" placeholder="Sua rua, avenida, etc." value={formData.address} onChange={handleChange} required />
                                </div>
                                <FormInput icon={ChevronsRight} id="number" type="text" label="Número" placeholder="123" value={formData.number} onChange={handleChange} required />
                                <FormInput icon={Building} id="complement" type="text" label="Complemento" placeholder="Apto, bloco, etc." value={formData.complement} onChange={handleChange} />
                                <FormInput icon={MapPin} id="district" type="text" label="Bairro" placeholder="Seu bairro" value={formData.district} onChange={handleChange} required />
                                <div className="grid-col-span-2">
                                    <FormInput icon={MapPin} id="city" type="text" label="Cidade" placeholder="Sua cidade" value={formData.city} onChange={handleChange} required />
                                </div>
                                <FormInput icon={MapPin} id="state" type="text" label="Estado" placeholder="UF" value={formData.state} onChange={handleChange} required />
                            </div>
                        </fieldset>

                        <div className="submit-section">
                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Validando...' : 'Próximo Passo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationScreen;