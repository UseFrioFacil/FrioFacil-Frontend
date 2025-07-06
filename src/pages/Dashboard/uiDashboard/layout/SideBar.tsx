import type { FC, ElementType } from 'react';
import { 
    LogOut, X, Snowflake, LayoutDashboard, Users, Wrench, UsersRound, Calendar, DollarSign, Send, Building, Info, Settings
} from 'lucide-react';

type Role = 'admin' | 'funcionario';

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

export default Sidebar