import type { FC } from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { 
    Search, PlusCircle, MoreVertical, Trash2, Edit, ChevronLeft, ChevronRight as ChevronRightIcon, X
} from 'lucide-react';
import '../DashboardStyle.css'
import ConfirmationModal from '../../../components/Confirmation/ConfirmationModal';

type ClientType = 'PF' | 'PJ';

interface Cliente {
    id: number;
    name: string;
    email: string;
    telefone: string;
    endereco: string;
    clientType: ClientType;
    documentNumber: string;
    status: 'ativo' | 'inativo';
    since: string;
    avatarUrl: string;
}

const initialMockClientes: Cliente[] = [
    { id: 1, name: 'Refrigeração Ártico', email: 'contato@artico.com', telefone: '(11) 98765-4321', endereco: 'Av. Paulista, 1000, São Paulo - SP', clientType: 'PJ', documentNumber: '12.345.678/0001-99', status: 'ativo', since: '2022-03-15', avatarUrl: 'https://placehold.co/100x100/22D3EE/0E7490?text=R' },
    { id: 2, name: 'Maria Souza', email: 'maria.souza@email.com', telefone: '(21) 91234-5678', endereco: 'Rua das Flores, 123, Rio de Janeiro - RJ', clientType: 'PF', documentNumber: '123.456.789-00', status: 'ativo', since: '2021-11-20', avatarUrl: 'https://placehold.co/100x100/F472B6/9D2463?text=M' },
    { id: 6, name: 'Lucas Mendes', email: 'lucas.mendes@email.com', telefone: '(81) 98888-7777', endereco: 'Rua da Aurora, 456, Recife - PE', clientType: 'PF', documentNumber: '987.654.321-11', status: 'ativo', since: '2025-07-04', avatarUrl: 'https://placehold.co/100x100/34D399/065F46?text=L' },
];

const ClientModal: FC<{isOpen: boolean, onClose: () => void, onSave: (data: any) => void, clientToEdit: Cliente | null}> = ({ isOpen, onClose, onSave, clientToEdit }) => {
    const [formData, setFormData] = useState({ name: '', telefone: '', endereco: '', email: '', clientType: 'PF' as ClientType, documentNumber: '' });

    useEffect(() => {
        if (clientToEdit) {
            setFormData({ 
                name: clientToEdit.name, 
                telefone: clientToEdit.telefone, 
                endereco: clientToEdit.endereco, 
                email: clientToEdit.email, 
                clientType: clientToEdit.clientType,
                documentNumber: clientToEdit.documentNumber,
            });
        } else {
            setFormData({ name: '', telefone: '', endereco: '', email: '', clientType: 'PF', documentNumber: '' });
        }
    }, [clientToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({...formData, status: 'ativo'}); // Assume status 'ativo' on save
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h3>{clientToEdit ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h3>
                    <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form-container">
                    <div className="modal-body">
                        <div className="form-group-radio">
                            <label><input type="radio" name="clientType" value="PF" checked={formData.clientType === 'PF'} onChange={handleChange} /> Pessoa Física</label>
                            <label><input type="radio" name="clientType" value="PJ" checked={formData.clientType === 'PJ'} onChange={handleChange} /> Pessoa Jurídica</label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">{formData.clientType === 'PJ' ? 'Nome da Empresa' : 'Nome Completo'}</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="documentNumber">{formData.clientType === 'PJ' ? 'CNPJ' : 'CPF'}</label>
                            <input type="text" name="documentNumber" id="documentNumber" value={formData.documentNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefone">Telefone</label>
                            <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endereco">Endereço</label>
                            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} required placeholder="Rua, Nº, Bairro, Cidade - UF" />
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

export const ClientesView: FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>(initialMockClientes);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Cliente | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Cliente | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const CLIENTES_PER_PAGE = 5;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredClientes = useMemo(() =>
        clientes.filter(cliente =>
            cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.telefone.includes(searchTerm) ||
            cliente.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.documentNumber.includes(searchTerm)
        ), [searchTerm, clientes]);

    const paginatedClientes = useMemo(() =>
        filteredClientes.slice((currentPage - 1) * CLIENTES_PER_PAGE, currentPage * CLIENTES_PER_PAGE),
        [filteredClientes, currentPage]
    );
    
    const totalPages = Math.ceil(filteredClientes.length / CLIENTES_PER_PAGE);

    const handleAddClick = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (cliente: Cliente) => {
        setEditingClient(cliente);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteClick = (cliente: Cliente) => {
        setClientToDelete(cliente);
        setIsDeleteConfirmOpen(true);
        setOpenMenuId(null);
    };

    const confirmDelete = () => {
        if (clientToDelete) {
            setClientes(prev => prev.filter(c => c.id !== clientToDelete.id));
        }
        setIsDeleteConfirmOpen(false);
        setClientToDelete(null);
    };

    const handleSaveClient = (clientData: Omit<Cliente, 'id' | 'avatarUrl' | 'since'>) => {
        if (editingClient) {
            setClientes(prev => prev.map(c => c.id === editingClient.id ? { ...editingClient, ...clientData } : c));
        } else {
            const newClient: Cliente = {
                ...clientData,
                id: Date.now(),
                since: new Date().toISOString().split('T')[0],
                avatarUrl: `https://placehold.co/100x100/A3A3A3/FFFFFF?text=${clientData.name.charAt(0)}`
            };
            setClientes(prev => [newClient, ...prev]);
        }
        setIsModalOpen(false);
        setEditingClient(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Clientes</h2>
                    <p className="view-subtitle">Gerencie sua base de clientes.</p>
                </div>
                <div className="view-header-actions">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            className="search-input"
                        />
                    </div>
                    <button onClick={handleAddClick} className="button button-primary">
                        <PlusCircle size={20} />
                        <span className="button-text">Adicionar</span>
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead className="hide-sm">
                            <tr>
                                <th>Cliente</th>
                                <th>Status</th>
                                <th className="hide-md">Cliente Desde</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td data-label="Cliente">
                                        <div className="table-cell-user">
                                            <img className="avatar" src={cliente.avatarUrl} alt={`Avatar de ${cliente.name}`} />
                                            <div>
                                                <div className="text-main">{cliente.name}</div>
                                                <div className="text-sub">{cliente.clientType}: {cliente.documentNumber}</div>
                                                <div className="text-sub">{cliente.telefone}</div>
                                                <div className="text-sub">{cliente.endereco}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Status">
                                        <span className={`status-badge ${cliente.status === 'ativo' ? 'status-ativo' : 'status-inativo'}`}>
                                            {cliente.status}
                                        </span>
                                    </td>
                                    <td data-label="Cliente Desde" className="hide-md">
                                        {new Date(cliente.since).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="table-actions">
                                        <button onClick={() => setOpenMenuId(cliente.id === openMenuId ? null : cliente.id)} className="menu-button">
                                            <MoreVertical size={20} />
                                        </button>
                                        {openMenuId === cliente.id && (
                                            <div ref={menuRef} className="dropdown-menu">
                                                <a href="#" onClick={(e) => {e.preventDefault(); handleEditClick(cliente)}}><Edit size={16} /> Editar</a>
                                                <a href="#" onClick={(e) => {e.preventDefault(); handleDeleteClick(cliente)}} className="dropdown-delete"><Trash2 size={16} /> Excluir</a>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {totalPages > 0 && (
                    <div className="table-pagination">
                        <span>Página {currentPage} de {totalPages}</span>
                        <div className="pagination-buttons">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={20} /></button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRightIcon size={20} /></button>
                        </div>
                    </div>
                )}
                {paginatedClientes.length === 0 && (
                    <div className="table-empty">
                        <p>Nenhum cliente encontrado.</p>
                    </div>
                )}
            </div>
            <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveClient} clientToEdit={editingClient} />
            <ConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o cliente "${clientToDelete?.name}"? Esta ação não pode ser desfeita.`} />
        </div>
    );
};


export { initialMockClientes };
export type { Cliente };
export default ClientesView;
