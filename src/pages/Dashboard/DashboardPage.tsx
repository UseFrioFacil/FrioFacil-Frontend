import type { FC, ReactNode, ElementType } from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
    LayoutDashboard, Users, Wrench, UsersRound, Calendar, DollarSign, Send,
    LogOut, Building, Info, Bell, Menu, X, Snowflake,
    Search, PlusCircle, MoreVertical, Trash2, Edit, ChevronLeft, ChevronRight as ChevronRightIcon, AlertTriangle, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Image as ImageIcon, Settings
} from 'lucide-react';
import './DashboardStyle.css'; // Importe o arquivo CSS

// --- TIPOS E INTERFACES (Inalterado) ---
type Role = 'admin' | 'funcionario';
type ClientType = 'PF' | 'PJ';
type TransactionType = 'Receita' | 'Despesa';

interface UserProfile {
    name: string;
    role: Role;
    avatarUrl: string;
    company?: string;
}

interface DashboardNavLink {
    id: string;
    label: string;
    icon: ElementType;
}

interface StatCardProps {
    icon: ElementType;
    iconColor: string;
    title: string;
    value: string;
    description?: string;
}

interface Cliente {
    id: number;
    name: string;
    company?: string;
    email?: string;
    telefone: string;
    endereco: string;
    clientType: ClientType;
    documentNumber: string;
    status: 'ativo' | 'inativo';
    since: string;
    avatarUrl: string;
}

interface Funcionario {
    id: number;
    name: string;
    email: string;
    telefone: string;
    avatarUrl: string;
}

type ServicoStatus = 'Aguardando Contato' | 'Agendado' | 'Em Andamento' | 'Concluído' | 'Cancelado';

interface Servico {
    id: number;
    descricao: string;
    clienteId: number;
    funcionarioId: number | null;
    dataAgendamento: string | null;
    status: ServicoStatus;
    valor: number;
}

interface Transaction {
    id: number;
    description: string;
    type: TransactionType;
    amount: number;
    date: string;
}

interface Empresa {
    name: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    logoUrl: string;
}

// --- DADOS MOCKADOS (Inalterado) ---
const mockUsers: Record<Role, UserProfile> = {
    admin: { name: 'Ana Beatriz', role: 'admin', avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=A' },
    funcionario: { name: 'Carlos Silva', role: 'funcionario', company: 'FrioFácil Refrigeração', avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=C' }
};

const mockEmpresaData: Empresa = {
    name: 'FrioFácil Refrigeração',
    cnpj: '12.345.678/0001-00',
    endereco: 'Rua das Palmeiras, 123, Recife - PE',
    telefone: '(81) 3344-5566',
    email: 'contato@friofacil.com',
    logoUrl: 'https://placehold.co/150x150/E0F2FE/3B82F6?text=FF'
};

const initialMockClientes: Cliente[] = [
    { id: 1, name: 'Refrigeração Ártico', company: 'Supermercado Confiança', email: 'contato@artico.com', telefone: '(11) 98765-4321', endereco: 'Av. Paulista, 1000, São Paulo - SP', clientType: 'PJ', documentNumber: '12.345.678/0001-99', status: 'ativo', since: '2022-03-15', avatarUrl: 'https://placehold.co/100x100/22D3EE/0E7490?text=R' },
    { id: 2, name: 'Maria Souza', email: 'maria.souza@email.com', telefone: '(21) 91234-5678', endereco: 'Rua das Flores, 123, Rio de Janeiro - RJ', clientType: 'PF', documentNumber: '123.456.789-00', status: 'ativo', since: '2021-11-20', avatarUrl: 'https://placehold.co/100x100/F472B6/9D2463?text=M' },
    { id: 6, name: 'Lucas Mendes', telefone: '(81) 98888-7777', endereco: 'Rua da Aurora, 456, Recife - PE', clientType: 'PF', documentNumber: '987.654.321-11', status: 'ativo', since: '2025-07-04', avatarUrl: 'https://placehold.co/100x100/34D399/065F46?text=L' },
];

const initialMockFuncionarios: Funcionario[] = [
    { id: 1, name: 'Carlos Silva', email: 'carlos.silva@friofacil.com', telefone: '(11) 99999-1111', avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=C' },
    { id: 2, name: 'Mariana Lima', email: 'mariana.lima@friofacil.com', telefone: '(11) 99999-2222', avatarUrl: 'https://placehold.co/100x100/FCE7F3/DB2777?text=M' },
    { id: 3, name: 'Roberto Alves', email: 'roberto.alves@friofacil.com', telefone: '(11) 99999-3333', avatarUrl: 'https://placehold.co/100x100/D1FAE5/059669?text=R' },
];

const initialMockServicos: Servico[] = [
    { id: 6, descricao: 'Ar condicionado não gela e está pingando', clienteId: 6, funcionarioId: null, dataAgendamento: null, status: 'Aguardando Contato', valor: 0 },
    { id: 1, descricao: 'Manutenção Preventiva Ar Condicionado Split', clienteId: 1, funcionarioId: 1, dataAgendamento: '2025-07-10', status: 'Agendado', valor: 250.00 },
    { id: 2, descricao: 'Instalação de Câmara Fria', clienteId: 2, funcionarioId: 3, dataAgendamento: '2025-07-02', status: 'Concluído', valor: 3500.00 },
    { id: 3, descricao: 'Reparo em sistema de ventilação', clienteId: 2, funcionarioId: 2, dataAgendamento: '2025-07-04', status: 'Em Andamento', valor: 450.00 },
    { id: 4, descricao: 'Limpeza e Higienização de Dutos', clienteId: 1, funcionarioId: 1, dataAgendamento: '2025-06-28', status: 'Cancelado', valor: 800.00 },
    { id: 5, descricao: 'Troca de compressor', clienteId: 6, funcionarioId: 3, dataAgendamento: '2025-07-15', status: 'Agendado', valor: 1200.00 },
    { id: 7, descricao: 'Verificação de rotina', clienteId: 2, funcionarioId: 2, dataAgendamento: '2025-07-21', status: 'Agendado', valor: 150.00 },
];

const initialTransactions: Transaction[] = [
    { id: 1, description: "Serviço #2 - Instalação de Câmara Fria", type: "Receita", amount: 3500, date: "2025-07-03" },
    { id: 2, description: "Compra de Ferramentas", type: "Despesa", amount: 450, date: "2025-07-01" },
    { id: 3, description: "Adiantamento Funcionário", type: "Despesa", amount: 300, date: "2025-06-30" },
    { id: 4, description: "Serviço #X - ...", type: "Receita", amount: 800, date: "2025-06-25" },
];

const adminNavLinks: DashboardNavLink[] = [
    { id: 'inicio', label: 'Início', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'servicos', label: 'Serviços', icon: Wrench },
    { id: 'funcionarios', label: 'Funcionários', icon: UsersRound },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'notificacoes', label: 'Notificações', icon: Send },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

const funcionarioNavLinks: DashboardNavLink[] = [
    { id: 'inicio', label: 'Início', icon: LayoutDashboard },
    { id: 'servicos', label: 'Meus Serviços', icon: Wrench },
    { id: 'agenda', label: 'Minha Agenda', icon: Calendar },
    { id: 'empresa', label: 'Empresa', icon: Building },
    { id: 'informacoes', label: 'Informações', icon: Info },
];

// --- COMPONENTES DE UI REUTILIZÁVEIS ---
const StatCard: FC<StatCardProps> = ({ icon: Icon, iconColor, title, value, description }) => (
    <div className="stat-card">
        <div className={`stat-card-icon-container ${iconColor}`}>
            <Icon className="stat-card-icon" />
        </div>
        <div>
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value">{value}</p>
            {description && <p className="stat-card-description">{description}</p>}
        </div>
    </div>
);

// --- COMPONENTES DE CONTEÚDO (VIEWS) ---
const DashboardHomeView: FC<{ user: UserProfile }> = ({ user }) => (
    <div className="fade-in">
        <h2 className="view-title">Bem-vindo(a), {user.name.split(' ')[0]}!</h2>
        <p className="view-subtitle">Este é o resumo da sua operação hoje. Use o menu lateral para navegar.</p>
        <div className="stats-grid">
            <StatCard icon={Wrench} iconColor="bg-blue-500" title="Serviços para Hoje" value="5" description="+2 desde ontem" />
            <StatCard icon={Users} iconColor="bg-green-500" title="Clientes Ativos" value="87" description="1 novo este mês" />
            <StatCard icon={DollarSign} iconColor="bg-yellow-500" title="Pagamentos Pendentes" value="R$1.250" description="Vencendo em 3 dias" />
        </div>
    </div>
);

const ClientesView: FC = () => {
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
            (cliente.company && cliente.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
        <div className="fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Clientes</h2>
                    <p className="view-subtitle">Gerencie sua base de clientes.</p>
                </div>
                <div className="header-actions">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="search-input"
                        />
                    </div>
                    <button onClick={handleAddClick} className="button button-primary">
                        <PlusCircle className="button-icon" />
                        <span className="add-button-text">Adicionar</span>
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th scope="col" className="table-header">Cliente</th>
                                <th scope="col" className="table-header">Status</th>
                                <th scope="col" className="table-header hide-md">Cliente Desde</th>
                                <th scope="col" className="table-header"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClientes.map(cliente => (
                                <tr key={cliente.id} className="table-row">
                                    <td className="table-cell">
                                        <div className="user-info">
                                            <img className="avatar" src={cliente.avatarUrl} alt={`Avatar de ${cliente.name}`} />
                                            <div>
                                                <div className="user-name">{cliente.name}</div>
                                                <div className="user-details">{cliente.clientType}: {cliente.documentNumber}</div>
                                                <div className="user-details">{cliente.telefone}</div>
                                                <div className="user-sub-details">{cliente.endereco}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`status-badge ${cliente.status === 'ativo' ? 'status-active' : 'status-inactive'}`}>
                                            {cliente.status}
                                        </span>
                                    </td>
                                    <td className="table-cell hide-md">
                                        {new Date(cliente.since).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="table-cell actions-cell">
                                        <button aria-label="Abrir menu de ações" onClick={() => setOpenMenuId(cliente.id === openMenuId ? null : cliente.id)} className="action-menu-button">
                                            <MoreVertical className="action-menu-icon" />
                                        </button>
                                        {openMenuId === cliente.id && (
                                            <div ref={menuRef} className="action-menu">
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(cliente) }} className="action-menu-item">
                                                    <Edit className="action-menu-item-icon" /> Editar
                                                </a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(cliente) }} className="action-menu-item action-menu-item-delete">
                                                    <Trash2 className="action-menu-item-icon" /> Excluir
                                                </a>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 0 && (
                    <div className="pagination-container">
                        <span className="pagination-info">
                            Página {currentPage} de {totalPages}
                        </span>
                        <div className="pagination-controls">
                            <button aria-label="Página anterior" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-button">
                                <ChevronLeft className="pagination-icon" />
                            </button>
                            <button aria-label="Próxima página" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-button">
                                <ChevronRightIcon className="pagination-icon" />
                            </button>
                        </div>
                    </div>
                )}
                {paginatedClientes.length === 0 && (
                    <div className="no-results">
                        <p>Nenhum cliente encontrado.</p>
                    </div>
                )}
            </div>
            <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveClient} clientToEdit={editingClient} />
            <ConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o cliente "${clientToDelete?.name}"? Esta ação não pode ser desfeita.`} />
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

    const getStatusClass = (status: ServicoStatus) => {
        switch (status) {
            case 'Aguardando Contato': return 'status-purple';
            case 'Agendado': return 'status-blue';
            case 'Em Andamento': return 'status-yellow';
            case 'Concluído': return 'status-green';
            case 'Cancelado': return 'status-red';
            default: return 'status-gray';
        }
    };

    const findClienteName = (id: number) => clientes.find(c => c.id === id)?.name || 'Desconhecido';
    const findFuncionario = (id: number | null) => id ? funcionarios.find(f => f.id === id) : null;

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
            findClienteName(servico.clienteId).toLowerCase().includes(searchTerm.toLowerCase()) ||
            findFuncionario(servico.funcionarioId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm, servicos, findClienteName, findFuncionario]);

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
        <div className="fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Ordens de Serviço</h2>
                    <p className="view-subtitle">Gerencie todos os serviços agendados e realizados.</p>
                </div>
                <div className="header-actions">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar serviço, cliente..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="search-input"
                        />
                    </div>
                    <button onClick={handleAddClick} className="button button-primary">
                        <PlusCircle className="button-icon" />
                        <span className="add-button-text">Adicionar</span>
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th scope="col" className="table-header">Serviço / Cliente</th>
                                <th scope="col" className="table-header hide-lg">Funcionário</th>
                                <th scope="col" className="table-header hide-md">Data Agendada</th>
                                <th scope="col" className="table-header">Status</th>
                                <th scope="col" className="table-header"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedServicos.map(servico => {
                                const funcionario = findFuncionario(servico.funcionarioId);
                                return (
                                    <tr key={servico.id} className="table-row">
                                        <td className="table-cell">
                                            <div className="service-desc">{servico.descricao}</div>
                                            <div className="service-client-name">{findClienteName(servico.clienteId)}</div>
                                        </td>
                                        <td className="table-cell hide-lg">
                                            {funcionario ? (
                                                <div className="user-info">
                                                    <img src={funcionario.avatarUrl} alt={funcionario.name} className="avatar-sm" />
                                                    <span className="user-name-sm">{funcionario.name}</span>
                                                </div>
                                            ) : (
                                                <span className="italic-gray">Não atribuído</span>
                                            )}
                                        </td>
                                        <td className="table-cell hide-md">
                                            {servico.dataAgendamento ? new Date(servico.dataAgendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : <span className="italic-gray">A definir</span>}
                                        </td>
                                        <td className="table-cell">
                                            <span className={`status-badge-inline ${getStatusClass(servico.status)}`}>
                                                {servico.status}
                                            </span>
                                        </td>
                                        <td className="table-cell actions-cell">
                                            <button aria-label="Abrir menu de ações" onClick={() => setOpenMenuId(servico.id === openMenuId ? null : servico.id)} className="action-menu-button">
                                                <MoreVertical className="action-menu-icon" />
                                            </button>
                                            {openMenuId === servico.id && (
                                                <div ref={menuRef} className="action-menu">
                                                    <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(servico) }} className="action-menu-item">
                                                        <Edit className="action-menu-item-icon" /> Editar
                                                    </a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(servico) }} className="action-menu-item action-menu-item-delete">
                                                        <Trash2 className="action-menu-item-icon" /> Excluir
                                                    </a>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {totalPages > 0 && (
                    <div className="pagination-container">
                        <span className="pagination-info">Página {currentPage} de {totalPages}</span>
                        <div className="pagination-controls">
                            <button aria-label="Página anterior" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-button">
                                <ChevronLeft className="pagination-icon" />
                            </button>
                            <button aria-label="Próxima página" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-button">
                                <ChevronRightIcon className="pagination-icon" />
                            </button>
                        </div>
                    </div>
                )}
                {paginatedServicos.length === 0 && (
                    <div className="no-results">
                        <p>Nenhum serviço encontrado.</p>
                    </div>
                )}
            </div>
            <ServicoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveServico} servicoToEdit={editingServico} clientes={clientes} funcionarios={funcionarios} />
            <ConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o serviço "${servicoToDelete?.descricao}"? Esta ação não pode ser desfeita.`} />
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
        <div className="fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Funcionários</h2>
                    <p className="view-subtitle">Gerencie a sua equipa de técnicos.</p>
                </div>
                <div className="header-actions">
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
                        <PlusCircle className="button-icon" />
                        <span className="add-button-text">Adicionar</span>
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th scope="col" className="table-header">Funcionário</th>
                                <th scope="col" className="table-header hide-md">Telefone</th>
                                <th scope="col" className="table-header"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFuncionarios.map(func => (
                                <tr key={func.id} className="table-row">
                                    <td className="table-cell">
                                        <div className="user-info">
                                            <img className="avatar" src={func.avatarUrl} alt={`Avatar de ${func.name}`} />
                                            <div>
                                                <div className="user-name">{func.name}</div>
                                                <div className="user-details">{func.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell hide-md">{func.telefone}</td>
                                    <td className="table-cell actions-cell">
                                        <button aria-label="Abrir menu de ações" onClick={() => setOpenMenuId(func.id === openMenuId ? null : func.id)} className="action-menu-button">
                                            <MoreVertical className="action-menu-icon" />
                                        </button>
                                        {openMenuId === func.id && (
                                            <div ref={menuRef} className="action-menu">
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(func); }} className="action-menu-item">
                                                    <Edit className="action-menu-item-icon" /> Editar
                                                </a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(func); }} className="action-menu-item action-menu-item-delete">
                                                    <Trash2 className="action-menu-item-icon" /> Excluir
                                                </a>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 0 && (
                    <div className="pagination-container">
                        <span className="pagination-info">Página {currentPage} de {totalPages}</span>
                        <div className="pagination-controls">
                            <button aria-label="Página anterior" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-button">
                                <ChevronLeft className="pagination-icon" />
                            </button>
                            <button aria-label="Próxima página" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-button">
                                <ChevronRightIcon className="pagination-icon" />
                            </button>
                        </div>
                    </div>
                )}
                {paginatedFuncionarios.length === 0 && (
                    <div className="no-results">
                        <p>Nenhum funcionário encontrado.</p>
                    </div>
                )}
            </div>
            <FuncionarioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveFuncionario} funcionarioToEdit={editingFuncionario} />
            <ConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o funcionário "${funcionarioToDelete?.name}"? Esta ação não pode ser desfeita.`} />
        </div>
    );
};

const AgendaView: FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 4));
    const [servicos] = useState<Servico[]>(initialMockServicos);
    const [clientes] = useState<Cliente[]>(initialMockClientes);
    const [funcionarios] = useState<Funcionario[]>(initialMockFuncionarios);
    const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

    const findCliente = (id: number) => clientes.find(c => c.id === id);
    const findFuncionario = (id: number | null) => id ? funcionarios.find(f => f.id === id) : null;

    const getStatusColorClass = (status: ServicoStatus) => {
        switch (status) {
            case 'Aguardando Contato': return 'bg-purple-500';
            case 'Agendado': return 'bg-blue-500';
            case 'Em Andamento': return 'bg-yellow-500';
            case 'Concluído': return 'bg-green-500';
            case 'Cancelado': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusBadgeClass = (status: ServicoStatus) => {
        switch (status) {
            case 'Aguardando Contato': return 'status-purple';
            case 'Agendado': return 'status-blue';
            case 'Em Andamento': return 'status-yellow';
            case 'Concluído': return 'status-green';
            case 'Cancelado': return 'status-red';
            default: return 'status-gray';
        }
    };

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const today = new Date();

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const servicesByDate = useMemo(() => {
        const grouped: { [key: string]: Servico[] } = {};
        servicos.forEach(servico => {
            if (servico.dataAgendamento) {
                const date = servico.dataAgendamento;
                if (!grouped[date]) {
                    grouped[date] = [];
                }
                grouped[date].push(servico);
            }
        });
        return grouped;
    }, [servicos]);

    return (
        <div className="fade-in">
            <div className="agenda-header">
                <h2 className="view-title">Agenda</h2>
                <div className="agenda-nav">
                    <button aria-label="Mês anterior" onClick={() => changeMonth(-1)} className="pagination-button"><ChevronLeft className="pagination-icon" /></button>
                    <span className="agenda-month">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button aria-label="Próximo mês" onClick={() => changeMonth(1)} className="pagination-button"><ChevronRightIcon className="pagination-icon" /></button>
                </div>
            </div>
            <div className="agenda-container">
                <div className="agenda-weekdays">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="agenda-grid">
                    {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} className="agenda-day-empty"></div>)}
                    {daysInMonth.map(day => {
                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                        const dailyServices = servicesByDate[dateStr] || [];
                        return (
                            <div key={day} className={`agenda-day ${isToday ? 'agenda-day-today' : ''}`}>
                                <span className={`agenda-day-number ${isToday ? 'agenda-day-number-today' : ''}`}>{day}</span>
                                <div className="agenda-services">
                                    {dailyServices.map(servico => (
                                        <button key={servico.id} onClick={() => setSelectedServico(servico)} className={`agenda-service-item ${getStatusColorClass(servico.status)}`}>
                                            {findCliente(servico.clienteId)?.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {selectedServico && (
                <div className="modal-overlay" onClick={() => setSelectedServico(null)}>
                    <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Detalhes do Serviço</h3>
                            <button aria-label="Fechar detalhes do serviço" onClick={() => setSelectedServico(null)} className="modal-close-button"><X className="modal-close-icon" /></button>
                        </div>
                        <div className="modal-body">
                            <div><strong>Cliente:</strong> {findCliente(selectedServico.clienteId)?.name}</div>
                            <div><strong>Descrição:</strong> {selectedServico.descricao}</div>
                            <div><strong>Funcionário:</strong> {findFuncionario(selectedServico.funcionarioId)?.name || 'Não atribuído'}</div>
                            <div><strong>Data:</strong> {new Date(selectedServico.dataAgendamento!).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                            <div><strong>Valor:</strong> R$ {selectedServico.valor.toFixed(2)}</div>
                            <div><strong>Status:</strong> <span className={`status-badge-inline ${getStatusBadgeClass(selectedServico.status)}`}>{selectedServico.status}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FinanceiroView: FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { receita, despesa, lucro } = useMemo(() => {
        const receita = transactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.amount, 0);
        const despesa = transactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.amount, 0);
        return { receita, despesa, lucro: receita - despesa };
    }, [transactions]);

    const handleSaveTransaction = (data: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...data,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setIsModalOpen(false);
    };

    return (
        <div className="fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Financeiro</h2>
                    <p className="view-subtitle">Acompanhe as suas receitas e despesas.</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => setIsModalOpen(true)} className="button button-primary">
                        <PlusCircle className="button-icon" />
                        <span>Nova Transação</span>
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon={TrendingUp} iconColor="bg-green-500" title="Faturamento Total" value={`R$ ${receita.toFixed(2)}`} />
                <StatCard icon={TrendingDown} iconColor="bg-red-500" title="Despesas Totais" value={`R$ ${despesa.toFixed(2)}`} />
                <StatCard icon={DollarSign} iconColor="bg-blue-500" title="Lucro Líquido" value={`R$ ${lucro.toFixed(2)}`} />
            </div>

            <div className="content-container-mt">
                <h3 className="content-title">Últimas Transações</h3>
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th scope="col" className="table-header">Descrição</th>
                                <th scope="col" className="table-header">Data</th>
                                <th scope="col" className="table-header text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} className="table-row">
                                    <td className="table-cell font-semibold">{t.description}</td>
                                    <td className="table-cell">{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td className={`table-cell text-right font-semibold ${t.type === 'Receita' ? 'text-green' : 'text-red'}`}>
                                        {t.type === 'Despesa' && '- '}R$ {t.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTransaction} />
        </div>
    );
};

const NotificacoesView: FC = () => {
    const [message, setMessage] = useState('');
    const [isAutomationOn, setIsAutomationOn] = useState(true);
    

    const templates = [
        { title: 'Lembrete de Manutenção', text: 'Olá, {cliente}! Passando para lembrar que a manutenção preventiva do seu ar condicionado está próxima. Vamos agendar?' },
        { title: 'Aviso de Pagamento', text: 'Olá, {cliente}. A sua fatura referente ao serviço {serviço} vence em 3 dias. Agradecemos a sua preferência!' },
        { title: 'Pesquisa de Satisfação', text: 'Olá, {cliente}! Gostaríamos de saber como foi a sua experiência com o nosso serviço. Poderia nos dar o seu feedback?' },
    ];

    return (
        <div className="fade-in">
            <h2 className="view-title">Notificações e Lembretes</h2>
            <p className="view-subtitle">Envie mensagens manuais ou configure lembretes automáticos para os seus clientes via WhatsApp.</p>

            <div className="notifications-grid">
                <div className="notifications-main-panel">
                    <h3 className="content-subtitle">Envio Manual de Mensagem</h3>
                    <div className="form-spacing">
                        <div>
                            <label htmlFor="message" className="form-label">Mensagem</label>
                            <textarea
                                id="message"
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-textarea"
                                placeholder="Escreva a sua mensagem aqui..."
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="recipients" className="form-label">Destinatários</label>
                            <input type="text" id="recipients" placeholder="Todos os clientes, ou selecione..." className="form-input" />
                        </div>
                        <button className="button button-whatsapp">
                            <div className="button-content">
                                <Send className="button-icon-sm" />
                                <span>Enviar via WhatsApp</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="notifications-side-panel">
                    <div className="content-container-sm">
                        <h3 className="content-subtitle">Modelos Rápidos</h3>
                        <div className="template-buttons">
                            {templates.map(template => (
                                <button key={template.title} onClick={() => setMessage(template.text)} className="template-button">
                                    {template.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="content-container-sm">
                        <h3 className="content-subtitle">Automações</h3>
                        <div className="automation-item">
                            <div>
                                <p className="automation-title">Lembrete de Manutenção</p>
                                <p className="automation-desc">Enviado 7 dias antes do prazo.</p>
                            </div>
                            
                            <button
                                type="button"
                                role="switch"
                                aria-checked={isAutomationOn ? 'true' : 'false'}
                                aria-label="Ativar ou desativar o lembrete de manutenção"
                                onClick={() => setIsAutomationOn(!isAutomationOn)}
                                className={isAutomationOn ? 'toggle-switch-on' : 'toggle-switch-off'}
                            >
                                <span 
                                className={isAutomationOn ? 'toggle-switch-handle-on' : 'toggle-switch-handle-off'}
                                ></span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const EmpresaView: FC = () => {
    const empresa = mockEmpresaData;
    return (
        <div className="fade-in">
            <h2 className="view-title">Dados da Empresa</h2>
            <p className="view-subtitle">Informações sobre a sua empresa.</p>
            <div className="content-container-lg">
                <div className="empresa-info-container">
                    <img src={empresa.logoUrl} alt="Logo da Empresa" className="empresa-logo" onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/E0F2FE/3B82F6?text=Erro' }} />
                    <div className="empresa-details">
                        <h3 className="empresa-name">{empresa.name}</h3>
                        <p className="empresa-detail"><strong>CNPJ:</strong> {empresa.cnpj}</p>
                        <p className="empresa-detail"><strong>Endereço:</strong> {empresa.endereco}</p>
                        <p className="empresa-detail"><strong>Telefone:</strong> {empresa.telefone}</p>
                        <p className="empresa-detail"><strong>Email:</strong> {empresa.email}</p>
                    </div>
                </div>
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
        <div className="fade-in">
            <h2 className="view-title">Configurações da Empresa</h2>
            <p className="view-subtitle">Gerencie as informações e a aparência da sua empresa.</p>
            <div className="content-container-lg">
                <div className="empresa-info-container">
                    <div className="logo-container">
                        <img src={empresa.logoUrl} alt="Logo da Empresa" className="empresa-logo" onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/E0F2FE/3B82F6?text=Erro' }} />
                        <button aria-label="Alterar logótipo" onClick={() => setIsLogoModalOpen(true)} className="logo-overlay">
                            <ImageIcon className="logo-overlay-icon" />
                        </button>
                    </div>
                    <div className="empresa-details flex-1">
                        <h3 className="empresa-name">{empresa.name}</h3>
                        <p className="empresa-detail"><strong>CNPJ:</strong> {empresa.cnpj}</p>
                        <p className="empresa-detail"><strong>Endereço:</strong> {empresa.endereco}</p>
                        <p className="empresa-detail"><strong>Telefone:</strong> {empresa.telefone}</p>
                        <p className="empresa-detail"><strong>Email:</strong> {empresa.email}</p>
                    </div>
                    <div>
                        <button onClick={() => setIsEditModalOpen(true)} className="button button-secondary">
                            <Edit className="button-icon-sm" />
                            Editar Dados
                        </button>
                    </div>
                </div>
            </div>
            <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} onSave={(logoUrl) => handleSave({ ...empresa, logoUrl })} currentLogoUrl={empresa.logoUrl} />
            <EmpresaModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSave} empresa={empresa} />
        </div>
    );
};

const InformacoesView: FC = () => {
    const FaqItem: FC<{ question: string; answer: string }> = ({ question, answer }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="faq-item">
                <button
                    className="faq-question-button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <h4 className="faq-question-text">{question}</h4>
                    {isOpen ? <ChevronUp className="faq-icon-open" /> : <ChevronDown className="faq-icon-closed" />}
                </button>
                {isOpen && (
                    <div className="faq-answer">
                        <p>{answer}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fade-in">
            <h2 className="view-title">Informações e Políticas</h2>
            <p className="view-subtitle">Políticas e diretrizes importantes para a equipa.</p>
            <div className="content-container-md">
                <FaqItem
                    question="Código de Vestimenta"
                    answer="Todos os técnicos devem usar o uniforme completo fornecido pela empresa durante o horário de trabalho. O uniforme deve estar sempre limpo e em bom estado. O uso de calçado de segurança é obrigatório em todas as visitas técnicas."
                />
                <FaqItem
                    question="Política de Reembolso de Despesas"
                    answer="Despesas com combustível e pequenas ferramentas (até R$50,00) podem ser reembolsadas mediante apresentação de nota fiscal. As solicitações de reembolso devem ser feitas através do portal do funcionário até ao dia 25 de cada mês."
                />
                <FaqItem
                    question="Protocolo de Atendimento ao Cliente"
                    answer="Seja sempre cordial e profissional. Apresente-se ao chegar no local, explique o serviço que será realizado e, ao finalizar, mostre ao cliente o que foi feito e peça a sua assinatura na ordem de serviço digital."
                />
            </div>
        </div>
    );
};


// --- MODAIS ---
const ClientModal: FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void, clientToEdit: Cliente | null }> = ({ isOpen, onClose, onSave, clientToEdit }) => {
    const [formData, setFormData] = useState({ name: '', telefone: '', endereco: '', email: '', company: '', clientType: 'PF' as ClientType, documentNumber: '', status: 'ativo' });

    useEffect(() => {
        if (clientToEdit) {
            setFormData({
                name: clientToEdit.name,
                telefone: clientToEdit.telefone,
                endereco: clientToEdit.endereco,
                email: clientToEdit.email || '',
                company: clientToEdit.company || '',
                clientType: clientToEdit.clientType,
                documentNumber: clientToEdit.documentNumber,
                status: clientToEdit.status
            });
        } else {
            setFormData({ name: '', telefone: '', endereco: '', email: '', company: '', clientType: 'PF', documentNumber: '', status: 'ativo' });
        }
    }, [clientToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            <div className="modal-content animate-fade-in max-w-md">
                <div className="modal-header">
                    <h3 className="modal-title">{clientToEdit ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h3>
                    <button aria-label="Fechar modal" onClick={onClose} className="modal-close-button"><X className="modal-close-icon" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="radio-group">
                            <label className="radio-label">
                                <input type="radio" name="clientType" value="PF" checked={formData.clientType === 'PF'} onChange={handleChange} />
                                Pessoa Física
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="clientType" value="PJ" checked={formData.clientType === 'PJ'} onChange={handleChange} />
                                Pessoa Jurídica
                            </label>
                        </div>
                        <div>
                            <label htmlFor="name" className="form-label">{formData.clientType === 'PJ' ? 'Nome da Empresa' : 'Nome Completo'}</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="documentNumber" className="form-label">{formData.clientType === 'PJ' ? 'CNPJ' : 'CPF'}</label>
                            <input type="text" name="documentNumber" id="documentNumber" value={formData.documentNumber} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="form-label">Telefone</label>
                            <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required className="form-input" placeholder="(XX) XXXXX-XXXX" />
                        </div>
                        <div>
                            <label htmlFor="endereco" className="form-label">Endereço</label>
                            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} required className="form-input" placeholder="Rua, Nº, Bairro, Cidade - UF" />
                        </div>
                        <div>
                            <label htmlFor="email" className="form-label">Email (Opcional)</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="form-input" />
                        </div>
                        {formData.clientType === 'PF' && (
                            <div>
                                <label htmlFor="company" className="form-label">Empresa (Opcional)</label>
                                <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="form-input" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="status" className="form-label">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="form-select">
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
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

const ServicoModal: FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void, servicoToEdit: Servico | null, clientes: Cliente[], funcionarios: Funcionario[] }> = ({ isOpen, onClose, onSave, servicoToEdit, clientes, funcionarios }) => {
    const initialState = {
        descricao: '',
        clienteId: '',
        funcionarioId: '',
        dataAgendamento: '',
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
            valor: Number(formData.valor),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in max-w-lg">
                <div className="modal-header">
                    <h3 className="modal-title">{servicoToEdit ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h3>
                    <button aria-label="Fechar modal" onClick={onClose} className="modal-close-button"><X className="modal-close-icon" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body-grid">
                        <div className="modal-grid-span-2">
                            <label htmlFor="descricao" className="form-label">Descrição do Serviço</label>
                            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} required rows={3} className="form-textarea"></textarea>
                        </div>
                        <div>
                            <label htmlFor="clienteId" className="form-label">Cliente</label>
                            <select name="clienteId" id="clienteId" value={formData.clienteId} onChange={handleChange} required className="form-select">
                                <option value="" disabled>Selecione um cliente</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="funcionarioId" className="form-label">Funcionário</label>
                            <select name="funcionarioId" id="funcionarioId" value={formData.funcionarioId} onChange={handleChange} className="form-select">
                                <option value="">Não atribuído</option>
                                {funcionarios.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dataAgendamento" className="form-label">Data de Agendamento</label>
                            <input type="date" name="dataAgendamento" id="dataAgendamento" value={formData.dataAgendamento} onChange={handleChange} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="valor" className="form-label">Valor (R$)</label>
                            <input type="number" step="0.01" name="valor" id="valor" value={formData.valor} onChange={handleChange} required className="form-input" />
                        </div>
                        <div className="modal-grid-span-2">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="form-select">
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

const FuncionarioModal: FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void, funcionarioToEdit: Funcionario | null }> = ({ isOpen, onClose, onSave, funcionarioToEdit }) => {
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
            <div className="modal-content animate-fade-in max-w-md">
                <div className="modal-header">
                    <h3 className="modal-title">{funcionarioToEdit ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h3>
                    <button aria-label="Fechar modal" onClick={onClose} className="modal-close-button"><X className="modal-close-icon" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div>
                            <label htmlFor="name" className="form-label">Nome Completo</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="form-label">Telefone</label>
                            <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required className="form-input" placeholder="(XX) XXXXX-XXXX" />
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

const TransactionModal: FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {
    const initialState = { description: '', amount: '', type: 'Receita' as TransactionType };
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, amount: Number(formData.amount) });
        setFormData(initialState);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in max-w-md">
                <div className="modal-header">
                    <h3 className="modal-title">Nova Transação</h3>
                    <button aria-label="Fechar modal" onClick={onClose} className="modal-close-button"><X className="modal-close-icon" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div>
                            <label htmlFor="description" className="form-label">Descrição</label>
                            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="form-label">Valor (R$)</label>
                            <input type="number" step="0.01" name="amount" id="amount" value={formData.amount} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="type" className="form-label">Tipo</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="form-select">
                                <option value="Receita">Receita</option>
                                <option value="Despesa">Despesa</option>
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

const LogoModal: FC<{ isOpen: boolean, onClose: () => void, onSave: (url: string) => void, currentLogoUrl: string }> = ({ isOpen, onClose, onSave, currentLogoUrl }) => {
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
            <div className="modal-content animate-fade-in max-w-md">
                <div className="modal-header">
                    <h3 className="modal-title">Alterar Logótipo da Empresa</h3>
                    <button aria-label="Fechar modal" onClick={onClose} className="modal-close-button"><X className="modal-close-icon" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div>
                            <label htmlFor="logoUrl" className="form-label">URL da Imagem do Logótipo</label>
                            <input type="url" name="logoUrl" id="logoUrl" value={url} onChange={(e) => setUrl(e.target.value)} required className="form-input" />
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

const EmpresaModal: FC<{ isOpen: boolean, onClose: () => void, onSave: (data: Empresa) => void, empresa: Empresa }> = ({ isOpen, onClose, onSave, empresa }) => {
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
            <div className="modal-content animate-fade-in max-w-md">
                <div className="modal-header">
                    <h3 className="modal-title">Editar Dados da Empresa</h3>
                    <button aria-label="Fechar modal" onClick={onClose} className="modal-close-button"><X className="modal-close-icon" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div>
                            <label htmlFor="name" className="form-label">Nome da Empresa</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="cnpj" className="form-label">CNPJ</label>
                            <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="endereco" className="form-label">Endereço</label>
                            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="form-label">Telefone</label>
                            <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="form-input" />
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

const ConfirmationModal: FC<{ isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in max-w-md">
                <div className="confirmation-content">
                    <div className="confirmation-icon-container">
                        <AlertTriangle className="confirmation-icon" />
                    </div>
                    <h3 className="confirmation-title">{title}</h3>
                    <div className="confirmation-message">
                        <p>{message}</p>
                    </div>
                </div>
                <div className="confirmation-footer">
                    <button onClick={onClose} className="button button-secondary button-full">Cancelar</button>
                    <button onClick={onConfirm} className="button button-danger button-full">Confirmar Exclusão</button>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTES DE LAYOUT ---
const Sidebar: FC<{ user: UserProfile; activeView: string; setActiveView: (view: string) => void; closeSidebar: () => void }> = ({ user, activeView, setActiveView, closeSidebar }) => {
    const navLinks = user.role === 'admin' ? adminNavLinks : funcionarioNavLinks;
    const handleLinkClick = (viewId: string) => {
        setActiveView(viewId);
        if (window.innerWidth < 768) { closeSidebar(); }
    };
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <a href="#" className="logo-link">
                    <Snowflake className="logo-icon" />
                    <span className="logo-text">FrioFácil</span>
                </a>
                <button onClick={closeSidebar} className="sidebar-close-button" aria-label="Fechar menu">
                    <X className="sidebar-close-icon" />
                </button>
            </div>
            <nav className="sidebar-nav">
                {navLinks.map(link => (
                    <a key={link.id} href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
                        className={`nav-link ${activeView === link.id ? 'nav-link-active' : ''}`}>
                        <link.icon className="nav-link-icon" />
                        <span>{link.label}</span>
                    </a>
                ))}
            </nav>
            <div className="sidebar-footer">
                <a href="#" className="nav-link">
                    <LogOut className="nav-link-icon" />
                    <span>Sair</span>
                </a>
            </div>
        </aside>
    );
};

const TopBar: FC<{ user: UserProfile; onToggleSidebar: () => void }> = ({ user, onToggleSidebar }) => (
    <header className="topbar">
        <button onClick={onToggleSidebar} className="menu-toggle-button" aria-label="Abrir menu">
            <Menu className="menu-toggle-icon" />
        </button>
        <div className="topbar-spacer"></div>
        <div className="topbar-actions">
            <button aria-label="Ver notificações" className="notification-button">
                <Bell className="notification-icon" />
                <span className="notification-badge"></span>
            </button>
            <div className="user-profile">
                <img src={user.avatarUrl} alt={`Avatar de ${user.name}`} className="user-avatar" />
                <div className="user-details-topbar">
                    <p className="user-name-topbar">{user.name}</p>
                    <p className="user-role-topbar">{user.role}</p>
                </div>
            </div>
        </div>
    </header>
);


// --- COMPONENTE PRINCIPAL DA PÁGINA DE DASHBOARD ---
export default function DashboardPage() {
    const [userRole, setUserRole] = useState<Role>('admin');
    const [activeView, setActiveView] = useState('inicio');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const currentUser = mockUsers[userRole];

    const renderContent = () => {
        const components: Record<string, ReactNode> = {
            inicio: <DashboardHomeView user={currentUser} />,
            clientes: <ClientesView />,
            servicos: <ServicosView />,
            funcionarios: <FuncionariosView />,
            agenda: <AgendaView />,
            financeiro: <FinanceiroView />,
            notificacoes: <NotificacoesView />,
            empresa: <EmpresaView />,
            informacoes: <InformacoesView />,
            configuracoes: <ConfiguracoesView />,
        };
        return components[activeView] || <DashboardHomeView user={currentUser} />;
    };

    const RoleSwitcher = () => (
        <div className="role-switcher">
            <button onClick={() => { setUserRole('admin'); setActiveView('inicio') }}
                className={`role-button ${userRole === 'admin' ? 'role-button-active' : ''}`}>
                Admin
            </button>
            <button onClick={() => { setUserRole('funcionario'); setActiveView('inicio') }}
                className={`role-button ${userRole === 'funcionario' ? 'role-button-active' : ''}`}>
                Funcionário
            </button>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <RoleSwitcher />
            <div className={`sidebar-container-mobile ${isSidebarOpen ? 'open' : ''}`}>
                <Sidebar user={currentUser} activeView={activeView} setActiveView={setActiveView} closeSidebar={() => setIsSidebarOpen(false)} />
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            <div className="sidebar-container-desktop">
                <Sidebar user={currentUser} activeView={activeView} setActiveView={setActiveView} closeSidebar={() => { }} />
            </div>
            <div className="main-content-area">
                <TopBar user={currentUser} onToggleSidebar={() => setIsSidebarOpen(true)} />
                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}