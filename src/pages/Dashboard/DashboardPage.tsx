import type { FC, ReactNode, ElementType } from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Users, Wrench, UsersRound, Calendar, DollarSign, Send, 
    LogOut, Building, Info, Bell, Menu, X, Snowflake,
    Search, PlusCircle, MoreVertical, Trash2, Edit, ChevronLeft, ChevronRight as ChevronRightIcon, AlertTriangle, TrendingUp, TrendingDown, MessageSquare, ChevronUp, ChevronDown, Image as ImageIcon, Settings
} from 'lucide-react';

// --- TIPOS E INTERFACES ---

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
    email: string;
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
    horario: string | null;
    local: string;
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

// --- DADOS MOCKADOS (Simulando um banco de dados) ---

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
    { id: 1, name: 'Refrigeração Ártico', email: 'contato@artico.com', telefone: '(11) 98765-4321', endereco: 'Av. Paulista, 1000, São Paulo - SP', clientType: 'PJ', documentNumber: '12.345.678/0001-99', status: 'ativo', since: '2022-03-15', avatarUrl: 'https://placehold.co/100x100/22D3EE/0E7490?text=R' },
    { id: 2, name: 'Maria Souza', email: 'maria.souza@email.com', telefone: '(21) 91234-5678', endereco: 'Rua das Flores, 123, Rio de Janeiro - RJ', clientType: 'PF', documentNumber: '123.456.789-00', status: 'ativo', since: '2021-11-20', avatarUrl: 'https://placehold.co/100x100/F472B6/9D2463?text=M' },
    { id: 6, name: 'Lucas Mendes', email: 'lucas.mendes@email.com', telefone: '(81) 98888-7777', endereco: 'Rua da Aurora, 456, Recife - PE', clientType: 'PF', documentNumber: '987.654.321-11', status: 'ativo', since: '2025-07-04', avatarUrl: 'https://placehold.co/100x100/34D399/065F46?text=L' },
];

const initialMockFuncionarios: Funcionario[] = [
    { id: 1, name: 'Carlos Silva', email: 'carlos.silva@friofacil.com', telefone: '(11) 99999-1111', avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=C' },
    { id: 2, name: 'Mariana Lima', email: 'mariana.lima@friofacil.com', telefone: '(11) 99999-2222', avatarUrl: 'https://placehold.co/100x100/FCE7F3/DB2777?text=M' },
    { id: 3, name: 'Roberto Alves', email: 'roberto.alves@friofacil.com', telefone: '(11) 99999-3333', avatarUrl: 'https://placehold.co/100x100/D1FAE5/059669?text=R' },
];

const initialMockServicos: Servico[] = [
    { id: 6, descricao: 'Ar condicionado não gela e está pingando', clienteId: 6, funcionarioId: null, dataAgendamento: null, horario: null, local: 'Rua da Aurora, 456, Recife - PE', status: 'Aguardando Contato', valor: 0 },
    { id: 1, descricao: 'Manutenção Preventiva Ar Condicionado Split', clienteId: 1, funcionarioId: 1, dataAgendamento: '2025-07-10', horario: '09:00', local: 'Av. Paulista, 1000, Sala 5, São Paulo - SP', status: 'Agendado', valor: 250.00 },
    { id: 2, descricao: 'Instalação de Câmara Fria', clienteId: 2, funcionarioId: 3, dataAgendamento: '2025-07-02', horario: '14:00', local: 'Rua das Flores, 123, Rio de Janeiro - RJ', status: 'Concluído', valor: 3500.00 },
    { id: 3, descricao: 'Reparo em sistema de ventilação', clienteId: 2, funcionarioId: 2, dataAgendamento: '2025-07-04', horario: '11:00', local: 'Rua das Flores, 123, Apto 301, Rio de Janeiro - RJ', status: 'Em Andamento', valor: 450.00 },
    { id: 4, descricao: 'Limpeza e Higienização de Dutos', clienteId: 1, funcionarioId: 1, dataAgendamento: '2025-06-28', horario: '10:30', local: 'Av. Paulista, 1000, São Paulo - SP', status: 'Cancelado', valor: 800.00 },
    { id: 5, descricao: 'Troca de compressor', clienteId: 6, funcionarioId: 3, dataAgendamento: '2025-07-15', horario: '15:00', local: 'Rua da Aurora, 456, Recife - PE', status: 'Agendado', valor: 1200.00 },
    { id: 7, descricao: 'Verificação de rotina', clienteId: 2, funcionarioId: 2, dataAgendamento: '2025-07-21', horario: '16:00', local: 'Rua das Flores, 123, Rio de Janeiro - RJ', status: 'Agendado', valor: 150.00 },
];

const initialTransactions: Transaction[] = [
    { id: 1, description: "Serviço #2 - Instalação de Câmara Fria", type: "Receita", amount: 3500, date: "2025-07-03" },
    { id: 2, description: "Compra de Ferramentas", type: "Despesa", amount: 450, date: "2025-07-01" },
    { id: 3, description: "Adiantamento Funcionário", type: "Despesa", amount: 300, date: "2025-06-30" },
    { id: 4, description: "Serviço #X - ...", type: "Receita", amount: 800, date: "2025-06-25" },
];

//Opção da DashBoard

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
    { id: 'agenda', label: 'Minha Agenda', icon: Calendar },
    { id: 'empresa', label: 'Empresa', icon: Building },
    { id: 'informacoes', label: 'Informações', icon: Info },
];

// --- COMPONENTES DE UI REUTILIZÁVEIS ---

const StatCard: FC<StatCardProps> = ({ icon: Icon, iconColor, title, value, description }) => (
    <div className="stat-card">
        <div className="stat-card-icon" style={{ backgroundColor: iconColor }}>
            <Icon size={24} color="white" />
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
    <div className="animate-fade-in">
        <h2 className="view-title">Bem-vindo(a), {user.name.split(' ')[0]}!</h2>
        <p className="view-subtitle">Este é o resumo da sua operação hoje. Use o menu lateral para navegar.</p>
        <div className="stats-grid">
            <StatCard icon={Wrench} iconColor="#3b82f6" title="Serviços para Hoje" value="5" description="+2 desde ontem" />
            <StatCard icon={Users} iconColor="#22c55e" title="Clientes Ativos" value="87" description="1 novo este mês" />
            <StatCard icon={DollarSign} iconColor="#f59e0b" title="Pagamentos Pendentes" value="R$1.250" description="Vencendo em 3 dias" />
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

const AgendaView: FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 4)); // July 4, 2025
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
        <div className="animate-fade-in">
            <div className="view-header" style={{marginBottom: '1.5rem'}}>
                <h2 className="view-title">Agenda</h2>
                <div className="calendar-navigation">
                    <button onClick={() => changeMonth(-1)} className="nav-button"><ChevronLeft size={20} /></button>
                    <span className="calendar-month-year">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="nav-button"><ChevronRightIcon size={20} /></button>
                </div>
            </div>
            <div className="calendar-container">
                <div className="calendar-grid-header">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="calendar-grid">
                    {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
                    {daysInMonth.map(day => {
                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                        const dailyServices = servicesByDate[dateStr] || [];
                        return (
                            <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                                <span className="day-number">{day}</span>
                                <div className="services-list">
                                    {dailyServices.map(servico => (
                                        <button key={servico.id} onClick={() => setSelectedServico(servico)} className={`service-entry ${getStatusColorClass(servico.status)}`}>
                                            {servico.horario} - {findCliente(servico.clienteId)?.name}
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
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Detalhes do Serviço</h3>
                            <button onClick={() => setSelectedServico(null)} className="modal-close-button"><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Cliente:</strong> {findCliente(selectedServico.clienteId)?.name}</p>
                            <p><strong>Telefone:</strong> {findCliente(selectedServico.clienteId)?.telefone}</p>
                            <p><strong>Descrição:</strong> {selectedServico.descricao}</p>
                            <p><strong>Local:</strong> {selectedServico.local}</p>
                            <p><strong>Funcionário:</strong> {findFuncionario(selectedServico.funcionarioId)?.name || 'Não atribuído'}</p>
                            <p><strong>Data:</strong> {new Date(selectedServico.dataAgendamento!).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                            <p><strong>Horário:</strong> {selectedServico.horario}</p>
                            <p><strong>Valor:</strong> R$ {selectedServico.valor.toFixed(2)}</p>
                            <p><strong>Status:</strong> <span className={`status-badge ${getStatusColorClass(selectedServico.status)}`}>{selectedServico.status}</span></p>
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
        <div className="animate-fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Financeiro</h2>
                    <p className="view-subtitle">Acompanhe as suas receitas e despesas.</p>
                </div>
                <div className="view-header-actions">
                    <button onClick={() => setIsModalOpen(true)} className="button button-primary">
                        <PlusCircle size={20} />
                        <span>Nova Transação</span>
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon={TrendingUp} iconColor="#22c55e" title="Faturamento Total" value={`R$ ${receita.toFixed(2)}`} />
                <StatCard icon={TrendingDown} iconColor="#ef4444" title="Despesas Totais" value={`R$ ${despesa.toFixed(2)}`} />
                <StatCard icon={DollarSign} iconColor="#3b82f6" title="Lucro Líquido" value={`R$ ${lucro.toFixed(2)}`} />
            </div>

            <div className="table-container">
                <h3 className="table-title">Últimas Transações</h3>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead className="hide-sm">
                            <tr>
                                <th>Descrição</th>
                                <th>Data</th>
                                <th style={{textAlign: 'right'}}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td data-label="Descrição" className="text-main">{t.description}</td>
                                    <td data-label="Data">{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td data-label="Valor" className={`font-semibold ${t.type === 'Receita' ? 'text-green' : 'text-red'}`} style={{textAlign: 'right'}}>
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
    
    const templates = [
        { title: 'Lembrete de Manutenção', text: 'Olá, {cliente}! Passando para lembrar que a manutenção preventiva do seu ar condicionado está próxima. Vamos agendar?' },
        { title: 'Aviso de Pagamento', text: 'Olá, {cliente}. A sua fatura referente ao serviço {serviço} vence em 3 dias. Agradecemos a sua preferência!' },
        { title: 'Pesquisa de Satisfação', text: 'Olá, {cliente}! Gostaríamos de saber como foi a sua experiência com o nosso serviço. Poderia nos dar o seu feedback?' },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="view-title">Notificações e Lembretes</h2>
            <p className="view-subtitle">Envie mensagens manuais ou configure lembretes automáticos para os seus clientes via WhatsApp.</p>

            <div className="notifications-layout">
                <div className="notification-main-panel">
                    <h3>Envio Manual de Mensagem</h3>
                    <div className="form-group">
                        <label htmlFor="message">Mensagem</label>
                        <textarea
                            id="message"
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escreva a sua mensagem aqui..."
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipients">Destinatários</label>
                        <input type="text" id="recipients" placeholder="Todos os clientes, ou selecione..." />
                    </div>
                    <button className="button button-whatsapp">
                        <Send size={16} />
                        <span>Enviar via WhatsApp</span>
                    </button>
                </div>
                <div className="notification-sidebar">
                    <div className="card">
                        <h3>Modelos Rápidos</h3>
                        <div className="templates-list">
                            {templates.map(template => (
                                <button key={template.title} onClick={() => setMessage(template.text)} className="template-button">
                                    {template.title}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="card">
                        <h3>Automações</h3>
                         <div className="automation-item">
                             <div>
                                 <p className="font-semibold">Lembrete de Manutenção</p>
                                 <p className="text-xs">Enviado 7 dias antes do prazo.</p>
                             </div>
                             <button className="toggle-switch active">
                                 <span className="toggle-handle"></span>
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

const InformacoesView: FC = () => {
    const FaqItem: FC<{ question: string; answer: string }> = ({ question, answer }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="faq-item">
                <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                    <h4>{question}</h4>
                    {isOpen ? <ChevronUp size={20} color="#3b82f6" /> : <ChevronDown size={20} />}
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
       <div className="animate-fade-in">
             <h2 className="view-title">Informações e Políticas</h2>
             <p className="view-subtitle">Políticas e diretrizes importantes para a equipa.</p>
             <div className="card">
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

const TransactionModal: FC<{isOpen: boolean, onClose: () => void, onSave: (data: any) => void}> = ({ isOpen, onClose, onSave }) => {
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
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h3>Nova Transação</h3>
                    <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="description">Descrição</label>
                            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">Valor (R$)</label>
                            <input type="number" step="0.01" name="amount" id="amount" value={formData.amount} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Tipo</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange}>
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

const ConfirmationModal: FC<{isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in" style={{maxWidth: '448px'}}>
                <div style={{textAlign: 'center', padding: '1.5rem'}}>
                    <div className="confirmation-icon-wrapper">
                        <AlertTriangle size={24} color="#dc2626" />
                    </div>
                    <h3 className="confirmation-title">{title}</h3>
                    <div className="confirmation-message">
                        <p>{message}</p>
                    </div>
                </div>
                <div className="confirmation-footer">
                    <button onClick={onClose} className="button button-secondary">Cancelar</button>
                    <button onClick={onConfirm} className="button button-danger">Confirmar Exclusão</button>
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
                <a href="#" className="sidebar-logo">
                    <Snowflake size={32} color="#3b82f6" />
                    <span>FrioFácil</span>
                </a>
                <button onClick={closeSidebar} className="sidebar-close-button" aria-label="Fechar menu">
                    <X size={24} />
                </button>
            </div>
            <nav className="sidebar-nav">
                {navLinks.map(link => (
                    <a key={link.id} href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
                        className={`sidebar-nav-link ${activeView === link.id ? 'active' : ''}`}>
                        <link.icon size={20} />
                        <span>{link.label}</span>
                    </a>
                ))}
            </nav>
            <div className="sidebar-footer">
                <a href="#" className="sidebar-nav-link">
                    <LogOut size={20} />
                    <span>Sair</span>
                </a>
            </div>
        </aside>
    );
};

const TopBar: FC<{ user: UserProfile; onToggleSidebar: () => void }> = ({ user, onToggleSidebar }) => (
    <header className="topbar">
        <button onClick={onToggleSidebar} className="topbar-menu-button" aria-label="Abrir menu">
            <Menu size={24} />
        </button>
        <div className="topbar-spacer"></div>
        <div className="topbar-actions">
            <button className="topbar-icon-button">
                <Bell size={24} />
                <span className="notification-dot"></span>
            </button>
            <div className="topbar-user-profile">
                <img src={user.avatarUrl} alt={`Avatar de ${user.name}`} className="avatar" />
                <div className="topbar-user-info">
                    <p>{user.name}</p>
                    <small>{user.role}</small>
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
            <button onClick={() => {setUserRole('admin'); setActiveView('inicio')}}
                className={userRole === 'admin' ? 'active' : ''}>
                Admin
            </button>
            <button onClick={() => {setUserRole('funcionario'); setActiveView('inicio')}}
                className={userRole === 'funcionario' ? 'active' : ''}>
                Funcionário
            </button>
        </div>
    );

    return (
        <>
            <style>
                {`
                /* --- Reset & Globals --- */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body, #root { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: #1f2937; }
                button, input, select, textarea { font-family: inherit; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* --- Main Layout --- */
                .dashboard-layout { display: flex; height: 100vh; width: 100vw; overflow: hidden; }
                .sidebar-container-desktop { width: 256px; flex-shrink: 0; }
                .sidebar-container-mobile { position: fixed; inset: 0; z-index: 40; transform: translateX(-100%); transition: transform 0.3s ease-in-out; }
                .sidebar-container-mobile.open { transform: translateX(0); }
                .sidebar-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); z-index: 30; }
                .main-content-wrapper { flex: 1; display: flex; flex-direction: column; max-height: 100vh; }
                .main-content { flex: 1; overflow-y: auto; padding: 1.5rem; }

                /* --- Sidebar --- */
                .sidebar { background-color: white; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; height: 100%; }
                .sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e5e7eb; height: 64px; flex-shrink: 0; }
                .sidebar-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
                .sidebar-logo span { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
                .sidebar-close-button { display: none; background: none; border: none; cursor: pointer; }
                .sidebar-nav { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; }
                .sidebar-nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1rem; border-radius: 0.5rem; text-decoration: none; color: #4b5563; transition: background-color 0.2s, color 0.2s; }
                .sidebar-nav-link:hover { background-color: #f3f4f6; }
                .sidebar-nav-link.active { background-color: #dbeafe; color: #2563eb; font-weight: 600; }
                .sidebar-footer { padding: 1rem; border-top: 1px solid #e5e7eb; }

                /* --- TopBar --- */
                .topbar { background-color: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 10; border-bottom: 1px solid #e5e7eb; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; flex-shrink: 0; }
                .topbar-menu-button { display: none; background: none; border: none; cursor: pointer; color: #4b5563; }
                .topbar-spacer { flex: 1; }
                .topbar-actions { display: flex; align-items: center; gap: 1rem; }
                .topbar-icon-button { position: relative; color: #6b7280; background: none; border: none; cursor: pointer; }
                .topbar-icon-button:hover { color: #1f2937; }
                .notification-dot { position: absolute; top: 0; right: 0; height: 0.5rem; width: 0.5rem; border-radius: 9999px; background-color: #ef4444; border: 2px solid white; }
                .topbar-user-profile { display: flex; align-items: center; gap: 0.75rem; }
                .avatar { width: 40px; height: 40px; border-radius: 9999px; border: 2px solid #e5e7eb; }
                .topbar-user-info { text-align: right; }
                .topbar-user-info p { font-size: 0.875rem; font-weight: 600; color: #1f2937; }
                .topbar-user-info small { font-size: 0.75rem; color: #6b7280; text-transform: capitalize; }
                
                /* --- Role Switcher (Demo only) --- */
                .role-switcher { position: fixed; bottom: 1rem; right: 1.5rem; background-color: white; padding: 0.375rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 50; display: flex; gap: 0.25rem; border: 1px solid #e5e7eb; }
                .role-switcher button { padding: 0.25rem 0.75rem; font-size: 0.875rem; border-radius: 0.375rem; border: none; cursor: pointer; transition: all 0.2s; }
                .role-switcher button.active { background-color: #3b82f6; color: white; }
                .role-switcher button:not(.active) { background-color: #f3f4f6; }
                .role-switcher button:not(.active):hover { background-color: #e5e7eb; }

                /* --- General View Styles --- */
                .view-header { display: flex; flex-direction: column; gap: 1rem; }
                .view-title { font-size: 1.875rem; font-weight: bold; color: #111827; }
                .view-subtitle { margin-top: 0.25rem; color: #4b5563; }
                .view-header-actions { display: flex; flex-direction: column; align-items: stretch; gap: 0.5rem; }
                .search-container { position: relative; flex-grow: 1; }
                .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9ca3af; }
                .search-input { width: 100%; padding: 0.625rem 1rem 0.625rem 2.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
                .search-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); }
                .button { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600; padding: 0.625rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background-color 0.2s; }
                .button-primary { background-color: #3b82f6; color: white; }
                .button-primary:hover { background-color: #2563eb; }
                .button-secondary { background-color: #e5e7eb; color: #1f2937; }
                .button-secondary:hover { background-color: #d1d5db; }
                .button-danger { background-color: #dc2626; color: white; }
                .button-danger:hover { background-color: #b91c1c; }
                .button-whatsapp { background-color: #25d366; color: white; }
                .button-whatsapp:hover { background-color: #16a34a; }
                .button-text { display: inline; }

                /* --- Table Styles --- */
                .table-container { margin-top: 2rem; background-color: white; border-radius: 1rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); border: 1px solid #e5e7eb; overflow: hidden; }
                .table-wrapper { overflow-x: auto; }
                .data-table { width: 100%; font-size: 0.875rem; text-align: left; color: #6b7280; border-collapse: collapse; }
                .data-table thead { font-size: 0.75rem; color: #374151; text-transform: uppercase; background-color: #f9fafb; }
                .data-table th, .data-table td { padding: 1rem 1.5rem; }
                .data-table tbody tr { border-bottom: 1px solid #e5e7eb; }
                .data-table tbody tr:last-child { border-bottom: none; }
                .data-table tbody tr:hover { background-color: #f9fafb; }
                .table-cell-user { display: flex; align-items: center; gap: 0.75rem; }
                .table-cell-user .text-main, .table-cell-content .text-main { font-weight: 600; color: #111827; white-space: normal; }
                .table-cell-user .text-sub, .table-cell-content .text-sub { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; white-space: normal; }
                .table-cell-content { display: flex; flex-direction: column; gap: 0.25rem; }
                .status-badge { padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 500; border-radius: 9999px; display: inline-flex; white-space: nowrap; }
                .status-ativo { background-color: #dcfce7; color: #166534; }
                .status-inativo { background-color: #fee2e2; color: #991b1b; }
                .status-aguardando { background-color: #f3e8ff; color: #6b21a8; }
                .status-agendado { background-color: #dbeafe; color: #1e40af; }
                .status-andamento { background-color: #fef3c7; color: #92400e; }
                .status-concluido { background-color: #dcfce7; color: #166534; }
                .status-cancelado { background-color: #fee2e2; color: #991b1b; }
                .table-actions { position: relative; text-align: right; }
                .actions-wrapper { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; }
                .menu-button { padding: 0.5rem; border-radius: 0.375rem; background: none; border: none; cursor: pointer; color: #6b7280; }
                .menu-button:hover { background-color: #f3f4f6; }
                .whatsapp-button { padding: 0.5rem; border-radius: 0.375rem; color: #16a34a; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;}
                .whatsapp-button:hover { background-color: #dcfce7; }
                .dropdown-menu { position: absolute; right: 0; top: 100%; margin-top: 0.5rem; width: 160px; background-color: white; border-radius: 0.375rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; z-index: 20; }
                .dropdown-menu a { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; font-size: 0.875rem; color: #374151; text-decoration: none; }
                .dropdown-menu a:hover { background-color: #f3f4f6; }
                .dropdown-menu a.dropdown-delete { color: #dc2626; }
                .table-pagination { display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-top: 1px solid #e5e7eb; }
                .pagination-buttons { display: flex; align-items: center; gap: 0.5rem; }
                .pagination-buttons button { padding: 0.5rem; border-radius: 0.375rem; background: none; border: none; cursor: pointer; }
                .pagination-buttons button:hover { background-color: #f3f4f6; }
                .pagination-buttons button:disabled { opacity: 0.5; cursor: not-allowed; }
                .table-empty { text-align: center; padding: 3rem; }

                /* --- Modal Styles (CORRIGIDO) --- */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(17, 24, 39, 0.6);
                    backdrop-filter: blur(4px);
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-content {
                    background-color: white;
                    border-radius: 1rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 500px;
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                    overflow: hidden; /* Important: hides overflow on the container */
                }
                .modal-content.wide {
                    max-width: 672px;
                }
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    flex-shrink: 0;
                }
                .modal-header h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .modal-close-button {
                    padding: 0.25rem;
                    border-radius: 9999px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6b7280;
                }
                .modal-close-button:hover {
                    background-color: #f3f4f6;
                    color: #1f2937;
                }
                .modal-form-container {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    overflow: hidden; /* Crucial for child scrolling */
                }
                .modal-body {
                    padding: 1.5rem;
                    overflow-y: auto; /* This enables scrolling on the body */
                    flex-grow: 1; /* Allows the body to take up available space */
                }
                .modal-body.grid-2-col {
                    display: grid;
                    grid-template-columns: 1fr; /* Mobile-first: 1 column */
                    gap: 1rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 0.625rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                     outline: none;
                     border-color: #3b82f6;
                     box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
                }
                .form-group-radio {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }
                .form-group-radio label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    background-color: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                    flex-shrink: 0;
                }
                
                /* --- Confirmation Modal --- */
                .confirmation-icon-wrapper { height: 3rem; width: 3rem; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background-color: #fee2e2; }
                .confirmation-title { margin-top: 1.25rem; font-size: 1.125rem; font-weight: 500; color: #111827; }
                .confirmation-message { margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280; }
                .confirmation-footer { display: flex; justify-content: center; gap: 0.75rem; padding: 1.5rem; background-color: #f9fafb; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; }
                
                /* --- Specific View Styles --- */
                .stats-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; margin-top: 2rem; }
                .stat-card { background-color: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); border: 1px solid #e5e7eb; display: flex; align-items: flex-start; gap: 1rem; transition: box-shadow 0.3s; }
                .stat-card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .stat-card-icon { border-radius: 9999px; padding: 0.75rem; }
                .stat-card-title { font-size: 0.875rem; font-weight: 500; color: #6b7280; }
                .stat-card-value { font-size: 1.875rem; font-weight: bold; color: #111827; margin-top: 0.25rem; }
                .stat-card-description { font-size: 0.875rem; color: #9ca3af; margin-top: 0.25rem; }
                
                .calendar-container { background-color: white; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); border: 1px solid #e5e7eb; padding: 1rem; }
                .calendar-navigation { display: flex; align-items: center; gap: 1rem; }
                .calendar-month-year { font-size: 1.125rem; font-weight: 600; color: #374151; width: 8rem; text-align: center; }
                .nav-button { padding: 0.5rem; border-radius: 0.375rem; background: none; border: none; cursor: pointer; }
                .nav-button:hover { background-color: #f3f4f6; }
                .calendar-grid-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 600; color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem; }
                .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; }
                .calendar-day { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem; height: 8rem; display: flex; flex-direction: column; }
                .calendar-day.empty { border-color: transparent; }
                .calendar-day.today { border-color: #3b82f6; }
                .day-number { font-weight: 600; }
                .calendar-day.today .day-number { color: #2563eb; }
                .services-list { margin-top: 0.25rem; display: flex; flex-direction: column; gap: 0.25rem; overflow-y: auto; }
                .service-entry { width: 100%; text-align: left; font-size: 0.75rem; color: white; padding: 0.25rem; border-radius: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border: none; cursor: pointer; }
                .bg-purple-500 { background-color: #a855f7; }
                .bg-blue-500 { background-color: #3b82f6; }
                .bg-yellow-500 { background-color: #f59e0b; }
                .bg-green-500 { background-color: #22c55e; }
                .bg-red-500 { background-color: #ef4444; }

                .notifications-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 2rem; }
                .notification-main-panel, .card { background-color: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
                .notification-main-panel h3, .card h3 { font-size: 1.125rem; font-weight: bold; color: #111827; margin-bottom: 1rem; }
                .notification-sidebar { display: flex; flex-direction: column; gap: 1rem; }
                .templates-list { display: flex; flex-direction: column; gap: 0.5rem; }
                .template-button { width: 100%; text-align: left; font-size: 0.875rem; padding: 0.5rem; background-color: #f9fafb; border-radius: 0.375rem; border: none; cursor: pointer; }
                .template-button:hover { background-color: #f3f4f6; }
                .automation-item { display: flex; align-items: center; justify-content: space-between; }
                .toggle-switch { height: 1.5rem; width: 2.75rem; border-radius: 9999px; padding: 0.25rem; background-color: #22c55e; display: flex; align-items: center; transition: all 0.2s; border: none; cursor: pointer; }
                .toggle-handle { height: 1rem; width: 1rem; border-radius: 9999px; background-color: white; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); transform: translateX(1.25rem); transition: transform 0.2s; }
                
                .card.card-row { display: flex; flex-direction: column; gap: 1rem; }
                .empresa-logo { width: 6rem; height: 6rem; border-radius: 9999px; border: 4px solid #f3f4f6; }
                .empresa-details { display: flex; flex-direction: column; gap: 0.75rem; }
                .empresa-details h3 { font-size: 1.5rem; font-weight: bold; color: #111827; }
                .empresa-details p { color: #4b5563; }
                .logo-container { position: relative; }
                .logo-edit-button { position: absolute; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; border-radius: 9999px; opacity: 0; transition: opacity 0.2s; border: none; cursor: pointer; }
                .logo-container:hover .logo-edit-button { opacity: 1; }

                .faq-item { border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
                .faq-item:last-child { border-bottom: none; }
                .faq-question { width: 100%; display: flex; justify-content: space-between; align-items: center; text-align: left; background: none; border: none; cursor: pointer; }
                .faq-question h4 { font-size: 1rem; font-weight: 600; color: #111827; }
                .faq-answer { margin-top: 0.75rem; color: #4b5563; font-size: 0.875rem; line-height: 1.5; }

                /* --- Responsive --- */
                @media (max-width: 767px) {
                    .sidebar-container-desktop { display: none; }
                    .sidebar-close-button { display: block; }
                    .topbar-menu-button { display: block; }
                    .topbar-user-info { display: none; }
                    .view-header { flex-direction: column; align-items: stretch; }
                    .data-table thead.hide-sm { display: none; }
                    .data-table, .data-table tbody, .data-table tr { display: block; width: 100%; }
                    .data-table tr { border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem; padding: 1rem; }
                    .data-table td { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; text-align: right; flex-wrap: wrap; }
                    .data-table tr:last-child td:last-child { border-bottom: none; }
                    .data-table td::before { content: attr(data-label); font-weight: 600; color: #374151; margin-right: 1rem; text-align: left; white-space: nowrap; }
                    .table-actions { justify-content: flex-end !important; }
                    .table-actions::before { display: none; }
                    .data-table td .table-cell-user, .data-table td .table-cell-content {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 0.25rem;
                        text-align: right;
                        word-break: break-all;
                    }
                    .table-cell-user .avatar { display: none; }
                    .calendar-grid { grid-template-columns: 1fr; }
                    .calendar-day { height: auto; min-height: 4rem; }
                }
                @media (min-width: 768px) {
                    .view-header { flex-direction: row; align-items: center; justify-content: space-between; }
                    .stats-grid { grid-template-columns: repeat(3, 1fr); }
                    .notifications-layout { grid-template-columns: 2fr 1fr; }
                    .modal-body.grid-2-col { grid-template-columns: 1fr 1fr; }
                    .modal-body .span-2 { grid-column: span 2 / span 2; }
                    .hide-md { display: table-cell; }
                }
                 @media (max-width: 1024px) {
                    .hide-lg { display: none; }
                 }
                @media (min-width: 640px) {
                    .button-text { display: inline; }
                    .card.card-row { flex-direction: row; align-items: flex-start; gap: 2rem; }
                }
                `}
            </style>
            <div className="dashboard-layout">
                <div className={`sidebar-container-mobile ${isSidebarOpen ? 'open' : ''}`}>
                    <Sidebar user={currentUser} activeView={activeView} setActiveView={setActiveView} closeSidebar={() => setIsSidebarOpen(false)} />
                </div>
                {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
                
                <div className="sidebar-container-desktop">
                     <Sidebar user={currentUser} activeView={activeView} setActiveView={setActiveView} closeSidebar={() => {}} />
                </div>
                
                <div className="main-content-wrapper">
                    <TopBar user={currentUser} onToggleSidebar={() => setIsSidebarOpen(true)} />
                    <main className="main-content">
                        {renderContent()}
                    </main>
                </div>
                <RoleSwitcher />
            </div>
        </>
    );
}
