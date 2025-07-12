import type { ReactNode } from 'react';
import { useState } from 'react';
import './DashboardStyle.css'
import DashboardHomeView from './uiDashboard/DashboardHomeView.tsx';
//imports do componente Clientes
import ClientesView from './uiDashboard/ClientesView';
//imports do componente
import ServicosView from './uiDashboard/ServicesView.tsx';
//Funcionario
import FuncionariosView from './uiDashboard/FuncionariosView.tsx';
//Agenda
import AgendaView from './uiDashboard/AgendaView.tsx';
//Financeiro
import FinanceiroView from './uiDashboard/FinanceiroView.tsx';
//Notificacacoes
import NotificacoesView from './uiDashboard/NotificacoesView.tsx'
//Empresa
import EmpresaView from './uiDashboard/EmpresaView.tsx';
//Config
import ConfiguracoesView from './uiDashboard/ConfigView.tsx';
//Info
import InformacoesView from './uiDashboard/InformacoesView.tsx';
//Layout Sidebar
import Sidebar from './uiDashboard/layout/SideBar.tsx'
//LayoutTopBar
import TopBar from './uiDashboard/layout/TopBar.tsx';


// --- TIPOS E INTERFACES ---

type Role = 'admin' | 'funcionario';

interface UserProfile {
    name: string;
    role: Role;
    avatarUrl: string;
    company?: string;
}

// --- DADOS MOCKADOS (Simulando um banco de dados) ---

const mockUsers: Record<Role, UserProfile> = {
    admin: { name: 'Ana Beatriz', role: 'admin', avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=A' },
    funcionario: { name: 'Carlos Silva', role: 'funcionario', company: 'FrioFácil Refrigeração', avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=C' }
};

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
