import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../config/api';
import {
    User, Mail, Phone, Home, MapPin, Building, ChevronsRight, Briefcase, 
    CheckCircle, ArrowRight, Snowflake, ArrowLeft
} from 'lucide-react';
import FormInput from '../../../components/Form/FormInput';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrationScreen: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
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

    const handleNextStep = () => {
        // Validação básica para a primeira etapa
        const requiredFields = clientType === 'individual' 
            ? ['tradename', 'fullName', 'cpf', 'email', 'phone']
            : ['legalname', 'tradename', 'cnpj', 'email', 'phone'];
        
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
        
        if (missingFields.length > 0) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        setCurrentStep(2);
    };

    const handlePreviousStep = () => {
        setCurrentStep(1);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(API_URLS.CREATE_TEMP_COMPANY, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const paymentToken = response.data.paymentToken; 
            
            if (paymentToken) {
                toast.success("Dados validados com sucesso! Você será redirecionado.");
                navigate('/checkout', { 
                    state: { tokenTempCompany: paymentToken } 
                });
            } else {
                toast.error("Erro: O token de pagamento não foi recebido do servidor.");
            }

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
                    {/* Header com logo e título */}
                    <motion.div 
                        className="registration-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div 
                            className="logo-section"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    y: [0, -2, 0]
                                }}
                                transition={{ 
                                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }}
                                whileHover={{ 
                                    scale: 1.1,
                                    rotate: 0,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <Snowflake size={40} className="header-logo-icon" />
                            </motion.div>
                            <h1 className="registration-title">FrioFácil</h1>
                        </motion.div>
                        <h2 className="registration-subtitle">Cadastre sua Empresa</h2>
                        <p className="registration-description">
                            Preencha os campos abaixo para começar a usar o FrioFácil e transformar sua gestão de refrigeração.
                        </p>
                        
                        {/* Indicador de progresso */}
                        <div className="progress-indicator">
                            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                                <div className="step-number">1</div>
                                <span>Dados Básicos</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                                <div className="step-number">2</div>
                                <span>Endereço</span>
                            </div>
                        </div>
                    </motion.div>

                    <form className="registration-form" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {currentStep === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="form-step"
                                >
                                    {/* Seletor de Tipo de Cliente */}
                                    <motion.div 
                                        className="client-type-selector"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        <label className="client-type-label">Tipo de Cliente:</label>
                                        <div className="client-type-options">
                                            <motion.button
                                                type="button"
                                                className={`client-type-button ${clientType === 'individual' ? 'active' : ''}`}
                                                onClick={() => setClientType('individual')}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                <User size={20} />
                                                <span>Pessoa Física</span>
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                className={`client-type-button ${clientType === 'company' ? 'active' : ''}`}
                                                onClick={() => setClientType('company')}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                <Building size={20} />
                                                <span>Pessoa Jurídica</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* Seção de Dados do Cliente */}
                                    <motion.fieldset 
                                        className="form-section"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        <legend className="section-title">
                                            <CheckCircle size={20} />
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
                                    </motion.fieldset>

                                    <motion.div 
                                        className="step-actions"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                    >
                                        <motion.button 
                                            type="button" 
                                            className="next-button" 
                                            onClick={handleNextStep}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            Próximo
                                            <ArrowRight size={20} />
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="form-step"
                                >
                                    {/* Seção de Endereço */}
                                    <motion.fieldset 
                                        className="form-section"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        <legend className="section-title">
                                            <MapPin size={20} />
                                            Endereço
                                        </legend>
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
                                    </motion.fieldset>

                                    <motion.div 
                                        className="step-actions"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        <motion.button 
                                            type="button" 
                                            className="back-button" 
                                            onClick={handlePreviousStep}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <ArrowLeft size={20} />
                                            Voltar
                                        </motion.button>
                                        <motion.button 
                                            type="submit" 
                                            className="submit-button" 
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Snowflake size={20} />
                                                </motion.div>
                                            ) : (
                                                <>
                                                    Finalizar Cadastro
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationScreen;
