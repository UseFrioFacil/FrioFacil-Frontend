import type { FC } from "react";
import StatCard from "./layout/StatCard";
import { 
    Users, Wrench, DollarSign
} from 'lucide-react';

type Role = 'admin' | 'funcionario';

interface UserProfile {
    name: string;
    role: Role;
    avatarUrl: string;
    company?: string;
}

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

export default DashboardHomeView