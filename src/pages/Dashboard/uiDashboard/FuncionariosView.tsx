import type { FC } from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { 
    Search, PlusCircle, MoreVertical, Trash2, Edit, ChevronLeft, ChevronRight as ChevronRightIcon, X
} from 'lucide-react';
import ConfirmationModal from '../../../components/Confirmation/ConfirmationModal'

interface Funcionario {
    id: number;
    name: string;
    email: string;
    telefone: string;
    avatarUrl: string;
}

const initialMockFuncionarios: Funcionario[] = [
    { id: 1, name: 'Carlos Silva', email: 'carlos.silva@friofacil.com', telefone: '(11) 99999-1111', avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=C' },
    { id: 2, name: 'Mariana Lima', email: 'mariana.lima@friofacil.com', telefone: '(11) 99999-2222', avatarUrl: 'https://placehold.co/100x100/FCE7F3/DB2777?text=M' },
    { id: 3, name: 'Roberto Alves', email: 'roberto.alves@friofacil.com', telefone: '(11) 99999-3333', avatarUrl: 'https://placehold.co/100x100/D1FAE5/059669?text=R' },
];

const FuncionarioModal: FC<{isOpen: boolean, onClose: () => void, onSave: (data: any) => void, funcionarioToEdit: Funcionario | null}> = ({ isOpen, onClose, onSave, funcionarioToEdit }) => {
    const initialState = { name: '', email: '', telefone: '' };
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (funcionarioToEdit) {
            setFormData({
                name: funcionarioToEdit.name,
                email: funcionarioToEdit.email,
                telefone: funcionarioToEdit.telefone,
            });
        } else {
            setFormData(initialState);
        }
    }, [funcionarioToEdit, isOpen]);

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
                    <h3>{funcionarioToEdit ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h3>
                    <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name">Nome Completo</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefone">Telefone</label>
                            <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" />
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

const FuncionariosView: FC = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialMockFuncionarios);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [funcionarioToDelete, setFuncionarioToDelete] = useState<Funcionario | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const FUNCIONARIOS_PER_PAGE = 5;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredFuncionarios = useMemo(() =>
        funcionarios.filter(func =>
            func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            func.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            func.telefone.includes(searchTerm)
        ), [searchTerm, funcionarios]);

    const paginatedFuncionarios = useMemo(() =>
        filteredFuncionarios.slice((currentPage - 1) * FUNCIONARIOS_PER_PAGE, currentPage * FUNCIONARIOS_PER_PAGE),
        [filteredFuncionarios, currentPage]
    );

    const totalPages = Math.ceil(filteredFuncionarios.length / FUNCIONARIOS_PER_PAGE);

    const handleAddClick = () => {
        setEditingFuncionario(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (funcionario: Funcionario) => {
        setEditingFuncionario(funcionario);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteClick = (funcionario: Funcionario) => {
        setFuncionarioToDelete(funcionario);
        setIsDeleteConfirmOpen(true);
        setOpenMenuId(null);
    };

    const confirmDelete = () => {
        if (funcionarioToDelete) {
            setFuncionarios(prev => prev.filter(f => f.id !== funcionarioToDelete.id));
        }
        setIsDeleteConfirmOpen(false);
        setFuncionarioToDelete(null);
    };

    const handleSaveFuncionario = (funcionarioData: Omit<Funcionario, 'id' | 'avatarUrl'>) => {
        if (editingFuncionario) {
            setFuncionarios(prev => prev.map(f => f.id === editingFuncionario.id ? { ...editingFuncionario, ...funcionarioData } : f));
        } else {
            const newFuncionario: Funcionario = {
                ...funcionarioData,
                id: Date.now(),
                avatarUrl: `https://placehold.co/100x100/A3A3A3/FFFFFF?text=${funcionarioData.name.charAt(0)}`
            };
            setFuncionarios(prev => [newFuncionario, ...prev]);
        }
        setIsModalOpen(false);
        setEditingFuncionario(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Funcionários</h2>
                    <p className="view-subtitle">Gerencie a sua equipa de técnicos.</p>
                </div>
                <div className="view-header-actions">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar funcionário..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                                <th>Funcionário</th>
                                <th className="hide-md">Telefone</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFuncionarios.map(func => (
                                <tr key={func.id}>
                                    <td data-label="Funcionário">
                                        <div className="table-cell-user">
                                            <img className="avatar" src={func.avatarUrl} alt={`Avatar de ${func.name}`} />
                                            <div>
                                                <div className="text-main">{func.name}</div>
                                                <div className="text-sub">{func.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Telefone" className="hide-md">{func.telefone}</td>
                                    <td className="table-actions">
                                        <button onClick={() => setOpenMenuId(func.id === openMenuId ? null : func.id)} className="menu-button">
                                            <MoreVertical size={20} />
                                        </button>
                                        {openMenuId === func.id && (
                                            <div ref={menuRef} className="dropdown-menu">
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(func); }}><Edit size={16} /> Editar</a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(func); }} className="dropdown-delete"><Trash2 size={16} /> Excluir</a>
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
                {paginatedFuncionarios.length === 0 && (
                    <div className="table-empty">
                        <p>Nenhum funcionário encontrado.</p>
                    </div>
                )}
            </div>
            <FuncionarioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveFuncionario} funcionarioToEdit={editingFuncionario} />
            <ConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o funcionário "${funcionarioToDelete?.name}"? Esta ação não pode ser desfeita.`} />
        </div>
    );
};

export default FuncionariosView
export { initialMockFuncionarios };
export type {Funcionario}