import { useState } from 'react';

import { toast } from 'react-toastify';
import { 
    User,
    Mail,
    Phone,
    Calendar,
    Edit3,
    Save,
    X,
    CheckCircle,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './PersonalDataStyle.css';
import Header from '../../../components/Header/Header.tsx';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner.tsx';

// --- INTERFACES DE DADOS ---
interface PersonalData {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function PersonalDataPage() {

    // Estados dos dados
    const [personalData, setPersonalData] = useState<PersonalData>({
        fullName: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        birthDate: '1990-05-15'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState<PersonalData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Função para iniciar edição
    const handleStartEdit = () => {
        setOriginalData({ ...personalData });
        setIsEditing(true);
    };

    // Função para cancelar edição
    const handleCancelEdit = () => {
        if (originalData) {
            setPersonalData(originalData);
        }
        setIsEditing(false);
        setOriginalData(null);
    };

    // Função para salvar dados
    const handleSaveData = () => {
        setIsLoading(true);
        // Simular salvamento
        setTimeout(() => {
            toast.success('Dados pessoais atualizados com sucesso!');
            setIsEditing(false);
            setOriginalData(null);
            setIsLoading(false);
        }, 1000);
    };

    // Função para atualizar campo
    const handleFieldChange = (field: keyof PersonalData, value: string) => {
        setPersonalData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="personal-data-container">
            <LoadingSpinner isLoading={isLoading} />
            <Header showOptions={false} showMenu={false} showBackButton={true} />
            
            <main className="main-content">
                <div className="content-wrapper">
                    <motion.div 
                        className="header-section"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="title-section">
                            <h1 className="page-title">Dados Pessoais</h1>
                            <p className="page-subtitle">
                                Gerencie suas informações pessoais e mantenha seus dados atualizados.
                            </p>
                        </div>
                        {!isEditing && (
                            <motion.button 
                                onClick={handleStartEdit}
                                className="edit-button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Edit3 size={16} />
                                Editar Dados
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Personal Data Form */}
                    <motion.div 
                        className="personal-data-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="card-header">
                            <div className="header-icon">
                                <CheckCircle size={24} />
                            </div>
                            <div className="header-content">
                                <h2 className="card-title">Informações Pessoais</h2>
                                <p className="card-description">
                                    Mantenha seus dados pessoais sempre atualizados para uma melhor experiência.
                                </p>
                            </div>
                        </div>

                        <form className="personal-data-form">
                            <div className="form-section">
                                <div className="form-row">
                                    <motion.div 
                                        className="form-group"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                    >
                                        <label htmlFor="fullName">
                                            <User size={16} />
                                            Nome Completo
                                        </label>
                                        <input 
                                            type="text"
                                            id="fullName"
                                            value={personalData.fullName}
                                            onChange={(e) => handleFieldChange('fullName', e.target.value)}
                                            disabled={!isEditing}
                                            required
                                            placeholder="Seu nome completo"
                                        />
                                    </motion.div>
                                    <motion.div 
                                        className="form-group"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        <label htmlFor="cpf">
                                            <Lock size={16} />
                                            CPF
                                            <span className="field-note">(Não editável)</span>
                                        </label>
                                        <input 
                                            type="text"
                                            id="cpf"
                                            value={personalData.cpf}
                                            onChange={(e) => handleFieldChange('cpf', e.target.value)}
                                            disabled={true}
                                            required
                                            placeholder="000.000.000-00"
                                            className="disabled-field"
                                        />
                                    </motion.div>
                                </div>

                                <div className="form-row">
                                    <motion.div 
                                        className="form-group"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                    >
                                        <label htmlFor="email">
                                            <Mail size={16} />
                                            E-mail
                                        </label>
                                        <input 
                                            type="email"
                                            id="email"
                                            value={personalData.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            disabled={!isEditing}
                                            required
                                            placeholder="seu@email.com"
                                        />
                                    </motion.div>
                                    <motion.div 
                                        className="form-group"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                    >
                                        <label htmlFor="phone">
                                            <Phone size={16} />
                                            Telefone
                                        </label>
                                        <input 
                                            type="tel"
                                            id="phone"
                                            value={personalData.phone}
                                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                                            disabled={!isEditing}
                                            required
                                            placeholder="(00) 00000-0000"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div 
                                    className="form-group full-width"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                >
                                    <label htmlFor="birthDate">
                                        <Calendar size={16} />
                                        Data de Nascimento
                                    </label>
                                    <input 
                                        type="date"
                                        id="birthDate"
                                        value={personalData.birthDate}
                                        onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                                        disabled={!isEditing}
                                        required
                                    />
                                </motion.div>
                            </div>

                            {/* Action Buttons */}
                            <AnimatePresence>
                                {isEditing && (
                                    <motion.div 
                                        className="form-actions"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.button 
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="cancel-button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <X size={16} />
                                            Cancelar
                                        </motion.button>
                                        <motion.button 
                                            type="button"
                                            onClick={handleSaveData}
                                            className="save-button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <Save size={16} />
                                            Salvar Alterações
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
