import { X } from "lucide-react";
import type { FC } from "react";
import { useState,useEffect } from "react";


interface Empresa {
    name: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    logoUrl: string;
}

const mockEmpresaData: Empresa = {
    name: 'FrioFácil Refrigeração',
    cnpj: '12.345.678/0001-00',
    endereco: 'Rua das Palmeiras, 123, Recife - PE',
    telefone: '(81) 3344-5566',
    email: 'contato@friofacil.com',
    logoUrl: 'https://placehold.co/150x150/E0F2FE/3B82F6?text=FF'
};

const EmpresaModal: FC<{isOpen: boolean, onClose: () => void, onSave: (data: Empresa) => void, empresa: Empresa}> = ({ isOpen, onClose, onSave, empresa }) => {
    const [formData, setFormData] = useState(empresa);

    useEffect(() => {
        setFormData(empresa);
    }, [empresa, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h3>Editar Dados da Empresa</h3>
                    <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name">Nome da Empresa</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="cnpj">CNPJ</label>
                            <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endereco">Endereço</label>
                            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefone">Telefone</label>
                            <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
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


const EmpresaView: FC = () => {
    const empresa = mockEmpresaData;
    return (
        <div className="animate-fade-in">
             <h2 className="view-title">Dados da Empresa</h2>
             <p className="view-subtitle">Informações sobre a sua empresa.</p>
             <div className="card card-row">
                <img src={empresa.logoUrl} alt="Logo da Empresa" className="empresa-logo" onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/E0F2FE/3B82F6?text=Erro' }}/>
                <div className="empresa-details">
                    <h3>{empresa.name}</h3>
                    <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
                    <p><strong>Endereço:</strong> {empresa.endereco}</p>
                    <p><strong>Telefone:</strong> {empresa.telefone}</p>
                    <p><strong>Email:</strong> {empresa.email}</p>
                </div>
             </div>
        </div>
    );
};


export default EmpresaView
export {EmpresaModal}
export {mockEmpresaData}
export type {Empresa}