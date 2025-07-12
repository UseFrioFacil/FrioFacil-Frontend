import { Image as ImageIcon, Edit, X } from "lucide-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import type { Empresa } from './EmpresaView.tsx'
import {EmpresaModal} from './EmpresaView.tsx'
import { mockEmpresaData } from "./EmpresaView.tsx";

const LogoModal: FC<{isOpen: boolean, onClose: () => void, onSave: (url: string) => void, currentLogoUrl: string}> = ({ isOpen, onClose, onSave, currentLogoUrl }) => {
    const [url, setUrl] = useState(currentLogoUrl);

    useEffect(() => {
        setUrl(currentLogoUrl);
    }, [currentLogoUrl, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(url);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h3>Alterar Logótipo da Empresa</h3>
                    <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="logoUrl">URL da Imagem do Logótipo</label>
                            <input type="url" name="logoUrl" id="logoUrl" value={url} onChange={(e) => setUrl(e.target.value)} required />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="button button-secondary">Cancelar</button>
                        <button type="submit" className="button button-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ConfiguracoesView: FC = () => {
    const [empresa, setEmpresa] = useState<Empresa>(mockEmpresaData);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSave = (updatedData: Empresa) => {
        setEmpresa(updatedData);
        setIsEditModalOpen(false);
        setIsLogoModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
             <h2 className="view-title">Configurações da Empresa</h2>
             <p className="view-subtitle">Gerencie as informações e a aparência da sua empresa.</p>
             <div className="card card-row">
                <div className="logo-container">
                    <img src={empresa.logoUrl} alt="Logo da Empresa" className="empresa-logo" onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/E0F2FE/3B82F6?text=Erro' }}/>
                    <button onClick={() => setIsLogoModalOpen(true)} className="logo-edit-button">
                        <ImageIcon size={32} color="white" />
                    </button>
                </div>
                <div className="empresa-details">
                    <h3>{empresa.name}</h3>
                    <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
                    <p><strong>Endereço:</strong> {empresa.endereco}</p>
                    <p><strong>Telefone:</strong> {empresa.telefone}</p>
                    <p><strong>Email:</strong> {empresa.email}</p>
                </div>
                <div style={{marginLeft: 'auto'}}>
                     <button onClick={() => setIsEditModalOpen(true)} className="button button-secondary">
                         <Edit size={16} />
                         Editar Dados
                     </button>
                </div>
             </div>
             <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} onSave={(logoUrl) => handleSave({...empresa, logoUrl})} currentLogoUrl={empresa.logoUrl} />
             <EmpresaModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSave} empresa={empresa} />
        </div>
    );
};

export default ConfiguracoesView