import type { FC } from 'react';
import { useState } from 'react';
import { 
    Snowflake, 
    Bell, 
    ChevronDown, 
    LogOut, 
    Settings, 
    User,
} from 'lucide-react';

interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string;
}

const mockUser: UserProfile = {
    name: 'Ryan safadinha',
    email: 'ryan.barreto@email.com',
    avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=A',
};

const HeaderHome: FC<{ user: UserProfile }> = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="home-header">
            <div className="home-header-logo">
                <Snowflake size={32} color="#3b82f6" />
                <span>FrioFácil</span>
            </div>
            <div className="home-header-actions">
                <button className="home-header-icon-button">
                    <Bell size={22} />
                    <span className="home-header-notification-dot"></span>
                </button>
                <div className="home-header-user-menu-container">
                    <button className="home-header-user-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <img src={user.avatarUrl} alt={user.name} className="home-header-avatar" />
                        <span className="home-header-user-name">{user.name}</span>
                        <ChevronDown size={20} className={`home-header-chevron-icon ${isMenuOpen ? 'open' : ''}`} />
                    </button>
                    {isMenuOpen && (
                        <div className="home-header-dropdown-menu">
                            <div className="home-header-dropdown-user-info">
                                <p className="home-header-dropdown-user-name">{user.name}</p>
                                <p className="home-header-dropdown-user-email">{user.email}</p>
                            </div>
                            <a href="#" className="home-header-dropdown-item"><User size={16}/> Minha Conta</a>
                            <a href="#" className="home-header-dropdown-item"><Settings size={16}/> Configurações</a>
                            <a href="#" className="home-header-dropdown-item home-header-dropdown-item-danger"><LogOut size={16}/> Sair</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderHome
export { mockUser }