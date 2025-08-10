import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Save,
    X
} from 'lucide-react';
import './PersonalDataStyle.css';
import Header from '../../../components/Header/Header.tsx';

// --- INTERFACES DE DADOS ---
interface PersonalData {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function PersonalDataPage() {
    const navigate = useNavigate();

    // Estados dos dados
    const [personalData, setPersonalData] = useState<PersonalData>({
        fullName: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        birthDate: '1990-05-15',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState<PersonalData | null>(null);

    // Função para voltar
    const handleGoBack = () => {
        navigate('/minhaconta');
    };

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
        // Simular salvamento
        toast.success('Dados pessoais atualizados com sucesso!');
        setIsEditing(false);
        setOriginalData(null);
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
            <Header />
            
            <main className="main-content">
                <div className="content-wrapper">
                    {/* Back Link */}
                    <div className="back-link-section">
                        <button 
                            onClick={handleGoBack}
                            className="back-link"
                        >
                            <ArrowLeft size={16} />
                            Voltar para Minha Conta
                        </button>
                    </div>

                    <div className="header-section">
                        <h1 className="page-title">Dados Pessoais</h1>
                        {!isEditing && (
                            <button 
                                onClick={handleStartEdit}
                                className="edit-button"
                            >
                                <Edit3 size={16} />
                                Editar Dados
                            </button>
                        )}
                    </div>

                    {/* Personal Data Form */}
                    <div className="personal-data-card">
                        <form className="personal-data-form">
                            <div className="form-row">
                                <div className="form-group">
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
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cpf">
                                        <User size={16} />
                                        CPF
                                    </label>
                                    <input 
                                        type="text"
                                        id="cpf"
                                        value={personalData.cpf}
                                        onChange={(e) => handleFieldChange('cpf', e.target.value)}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
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
                                    />
                                </div>
                                <div className="form-group">
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
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
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
                                </div>
                            </div>

                            <div className="address-section">
                                <h3 className="section-title">
                                    <MapPin size={20} />
                                    Endereço
                                </h3>
                                
                                <div className="form-group">
                                    <label htmlFor="address">Endereço</label>
                                    <input 
                                        type="text"
                                        id="address"
                                        value={personalData.address}
                                        onChange={(e) => handleFieldChange('address', e.target.value)}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">Cidade</label>
                                        <input 
                                            type="text"
                                            id="city"
                                            value={personalData.city}
                                            onChange={(e) => handleFieldChange('city', e.target.value)}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="state">Estado</label>
                                        <input 
                                            type="text"
                                            id="state"
                                            value={personalData.state}
                                            onChange={(e) => handleFieldChange('state', e.target.value)}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="zipCode">CEP</label>
                                        <input 
                                            type="text"
                                            id="zipCode"
                                            value={personalData.zipCode}
                                            onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="form-actions">
                                    <button 
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="cancel-button"
                                    >
                                        <X size={16} />
                                        Cancelar
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleSaveData}
                                        className="save-button"
                                    >
                                        <Save size={16} />
                                        Salvar Alterações
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
