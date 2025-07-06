import type { FC } from 'react';
import { 
    Bell, Menu
} from 'lucide-react';

type Role = 'admin' | 'funcionario';

interface UserProfile {
    name: string;
    role: Role;
    avatarUrl: string;
    company?: string;
}

// --- DADOS MOCKADOS (Simulando um banco de dados) ---

// --- COMPONENTES DE LAYOUT ---

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

export default TopBar