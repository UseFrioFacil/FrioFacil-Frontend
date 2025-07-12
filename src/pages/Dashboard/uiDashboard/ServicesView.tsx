import type { FC } from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { 
    Search, PlusCircle, MoreVertical, Trash2, Edit, ChevronLeft, ChevronRight as ChevronRightIcon, MessageSquare, X
} from 'lucide-react';
import '../DashboardStyle.css'
import ConfirmationModal from '../../../components/Confirmation/ConfirmationModal.tsx';
import type { Cliente } from './ClientesView.tsx';
import { initialMockClientes } from './ClientesView';
import { initialMockFuncionarios } from './FuncionariosView.tsx';
import type { Funcionario } from './FuncionariosView.tsx';

type ServicoStatus = 'Aguardando Contato' | 'Agendado' | 'Em Andamento' | 'Concluído' | 'Cancelado';

interface Servico {
    id: number;
    descricao: string;
    clienteId: number;
    funcionarioId: number | null;
    dataAgendamento: string | null;
    horario: string | null;
    local: string;
    status: ServicoStatus;
    valor: number;
}

const initialMockServicos: Servico[] = [
    { id: 6, descricao: 'Ar condicionado não gela e está pingando', clienteId: 6, funcionarioId: null, dataAgendamento: null, horario: null, local: 'Rua da Aurora, 456, Recife - PE', status: 'Aguardando Contato', valor: 0 },
    { id: 1, descricao: 'Manutenção Preventiva Ar Condicionado Split', clienteId: 1, funcionarioId: 1, dataAgendamento: '2025-07-10', horario: '09:00', local: 'Av. Paulista, 1000, Sala 5, São Paulo - SP', status: 'Agendado', valor: 250.00 },
    { id: 2, descricao: 'Instalação de Câmara Fria', clienteId: 2, funcionarioId: 3, dataAgendamento: '2025-07-02', horario: '14:00', local: 'Rua das Flores, 123, Rio de Janeiro - RJ', status: 'Concluído', valor: 3500.00 },
    { id: 3, descricao: 'Reparo em sistema de ventilação', clienteId: 2, funcionarioId: 2, dataAgendamento: '2025-07-04', horario: '11:00', local: 'Rua das Flores, 123, Apto 301, Rio de Janeiro - RJ', status: 'Em Andamento', valor: 450.00 },
    { id: 4, descricao: 'Limpeza e Higienização de Dutos', clienteId: 1, funcionarioId: 1, dataAgendamento: '2025-06-28', horario: '10:30', local: 'Av. Paulista, 1000, São Paulo - SP', status: 'Cancelado', valor: 800.00 },
    { id: 5, descricao: 'Troca de compressor', clienteId: 6, funcionarioId: 3, dataAgendamento: '2025-07-15', horario: '15:00', local: 'Rua da Aurora, 456, Recife - PE', status: 'Agendado', valor: 1200.00 },
    { id: 7, descricao: 'Verificação de rotina', clienteId: 2, funcionarioId: 2, dataAgendamento: '2025-07-21', horario: '16:00', local: 'Rua das Flores, 123, Rio de Janeiro - RJ', status: 'Agendado', valor: 150.00 },
];

const ServicoModal: FC<{isOpen: boolean, onClose: () => void, onSave: (data: any) => void, servicoToEdit: Servico | null, clientes: Cliente[], funcionarios: Funcionario[]}> = ({ isOpen, onClose, onSave, servicoToEdit, clientes, funcionarios }) => {
    const initialState = {
        descricao: '',
        clienteId: '',
        funcionarioId: '',
        dataAgendamento: '',
        horario: '',
        local: '',
        valor: '',
        status: 'Agendado' as ServicoStatus
    };
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (servicoToEdit) {
            setFormData({
                descricao: servicoToEdit.descricao,
                clienteId: String(servicoToEdit.clienteId),
                funcionarioId: String(servicoToEdit.funcionarioId || ''),
                dataAgendamento: servicoToEdit.dataAgendamento || '',
                horario: servicoToEdit.horario || '',
                local: servicoToEdit.local || '',
                valor: String(servicoToEdit.valor),
                status: servicoToEdit.status
            });
        } else {
            setFormData(initialState);
        }
    }, [servicoToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            clienteId: Number(formData.clienteId),
            funcionarioId: formData.funcionarioId ? Number(formData.funcionarioId) : null,
            dataAgendamento: formData.dataAgendamento || null,
            horario: formData.horario || null,
            valor: Number(formData.valor),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content wide animate-fade-in">
                <div className="modal-header">
                    <h3>{servicoToEdit ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h3>
                    <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form-container">
                    <div className="modal-body grid-2-col">
                        <div className="form-group span-2">
                            <label htmlFor="descricao">Descrição do Serviço</label>
                            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} required rows={3}></textarea>
                        </div>
                         <div className="form-group span-2">
                            <label htmlFor="local">Local do Serviço</label>
                            <input type="text" name="local" id="local" value={formData.local} onChange={handleChange} required placeholder="Endereço onde o serviço será realizado" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clienteId">Cliente</label>
                            <select name="clienteId" id="clienteId" value={formData.clienteId} onChange={handleChange} required>
                                <option value="" disabled>Selecione um cliente</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="funcionarioId">Funcionário</label>
                            <select name="funcionarioId" id="funcionarioId" value={formData.funcionarioId} onChange={handleChange}>
                                <option value="">Não atribuído</option>
                                {funcionarios.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                         <div className="form-group">
                            <label htmlFor="dataAgendamento">Data de Agendamento</label>
                            <input type="date" name="dataAgendamento" id="dataAgendamento" value={formData.dataAgendamento} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="horario">Horário</label>
                            <input type="time" name="horario" id="horario" value={formData.horario} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="valor">Valor (R$)</label>
                            <input type="number" step="0.01" name="valor" id="valor" value={formData.valor} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange}>
                                <option>Aguardando Contato</option>
                                <option>Agendado</option>
                                <option>Em Andamento</option>
                                <option>Concluído</option>
                                <option>Cancelado</option>
                            </select>
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

const ServicosView: FC = () => {
    const [servicos, setServicos] = useState<Servico[]>(initialMockServicos);
    const [clientes] = useState<Cliente[]>(initialMockClientes);
    const [funcionarios] = useState<Funcionario[]>(initialMockFuncionarios);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServico, setEditingServico] = useState<Servico | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [servicoToDelete, setServicoToDelete] = useState<Servico | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const SERVICOS_PER_PAGE = 5;

    const getStatusColorClass = (status: ServicoStatus) => {
        switch (status) {
            case 'Aguardando Contato': return 'status-aguardando';
            case 'Agendado': return 'status-agendado';
            case 'Em Andamento': return 'status-andamento';
            case 'Concluído': return 'status-concluido';
            case 'Cancelado': return 'status-cancelado';
            default: return 'status-default';
        }
    };

    const findCliente = (id: number) => clientes.find(c => c.id === id);
    const findFuncionario = (id: number | null) => id ? funcionarios.find(f => f.id === id) : null;
    
    const formatPhoneNumberForWhatsApp = (phone: string | undefined): string => {
        if (!phone) return '';
        return '55' + phone.replace(/\D/g, '');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredServicos = useMemo(() =>
        servicos.filter(servico =>
            servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (findCliente(servico.clienteId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (findFuncionario(servico.funcionarioId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm, servicos]);

    const paginatedServicos = useMemo(() =>
        filteredServicos.slice((currentPage - 1) * SERVICOS_PER_PAGE, currentPage * SERVICOS_PER_PAGE),
        [filteredServicos, currentPage]
    );
    
    const totalPages = Math.ceil(filteredServicos.length / SERVICOS_PER_PAGE);

    const handleAddClick = () => {
        setEditingServico(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (servico: Servico) => {
        setEditingServico(servico);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteClick = (servico: Servico) => {
        setServicoToDelete(servico);
        setIsDeleteConfirmOpen(true);
        setOpenMenuId(null);
    };

    const confirmDelete = () => {
        if (servicoToDelete) {
            setServicos(prev => prev.filter(s => s.id !== servicoToDelete.id));
        }
        setIsDeleteConfirmOpen(false);
        setServicoToDelete(null);
    };

    const handleSaveServico = (servicoData: Omit<Servico, 'id'>) => {
        if (editingServico) {
            setServicos(prev => prev.map(s => s.id === editingServico.id ? { ...editingServico, ...servicoData } : s));
        } else {
            const newServico: Servico = {
                ...servicoData,
                id: Date.now(),
            };
            setServicos(prev => [newServico, ...prev]);
        }
        setIsModalOpen(false);
        setEditingServico(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Ordens de Serviço</h2>
                    <p className="view-subtitle">Gerencie todos os serviços agendados e realizados.</p>
                </div>
                <div className="view-header-actions">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar serviço, cliente..."
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
                                <th>Serviço / Cliente</th>
                                <th className="hide-lg">Funcionário</th>
                                <th className="hide-md">Data / Horário</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedServicos.map(servico => {
                                const funcionario = findFuncionario(servico.funcionarioId);
                                const cliente = findCliente(servico.clienteId);
                                const whatsappUrl = cliente ? `https://wa.me/${formatPhoneNumberForWhatsApp(cliente.telefone)}` : '#';

                                return (
                                <tr key={servico.id}>
                                    <td data-label="Serviço">
                                        <div className="table-cell-content">
                                            <span className="text-main">{servico.descricao}</span>
                                            <span className="text-sub">{cliente?.name || 'Desconhecido'}</span>
                                            <span className="text-sub">{cliente?.telefone}</span>
                                        </div>
                                    </td>
                                    <td data-label="Funcionário" className="hide-lg">
                                        {funcionario ? (
                                            <div className="table-cell-user">
                                                <img src={funcionario.avatarUrl} alt={funcionario.name} className="avatar small" />
                                                <span>{funcionario.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-italic">Não atribuído</span>
                                        )}
                                    </td>
                                    <td data-label="Data" className="hide-md">
                                        {servico.dataAgendamento ? (
                                            <div>
                                                <div>{new Date(servico.dataAgendamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</div>
                                                <div className="text-sub">{servico.horario || 'Hora a definir'}</div>
                                            </div>
                                        ) : <span className="text-italic">A definir</span>}
                                    </td>
                                    <td data-label="Status">
                                        <span className={`status-badge ${getStatusColorClass(servico.status)}`}>
                                            {servico.status}
                                        </span>
                                    </td>
                                    <td className="table-actions">
                                        <div className="actions-wrapper">
                                            {cliente && (
                                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Contactar no WhatsApp" className="whatsapp-button">
                                                    <MessageSquare size={20} />
                                                </a>
                                            )}
                                            <button onClick={() => setOpenMenuId(servico.id === openMenuId ? null : servico.id)} className="menu-button">
                                                <MoreVertical size={20} />
                                                {openMenuId === servico.id && (
                                                    <div ref={menuRef} className="dropdown-menu">
                                                        <a href="#" onClick={(e) => {e.preventDefault(); handleEditClick(servico)}}><Edit size={16} /> Editar</a>
                                                        <a href="#" onClick={(e) => {e.preventDefault(); handleDeleteClick(servico)}} className="dropdown-delete"><Trash2 size={16} /> Excluir</a>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
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
                {paginatedServicos.length === 0 && (
                    <div className="table-empty">
                        <p>Nenhum serviço encontrado.</p>
                    </div>
                )}
            </div>
            <ServicoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveServico} servicoToEdit={editingServico} clientes={clientes} funcionarios={funcionarios} />
            <ConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o serviço "${servicoToDelete?.descricao}"? Esta ação não pode ser desfeita.`} />
        </div>
    );
};

export default ServicosView
export { initialMockServicos };
export type { Funcionario };
export type {Servico}
export type {ServicoStatus}