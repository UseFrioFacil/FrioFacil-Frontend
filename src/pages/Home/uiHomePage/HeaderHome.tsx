import type { FC } from 'react';
import { useState } from 'react';
import {
    Snowflake,
    ChevronDown,
    LogOut,
    User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string;
}


const HeaderHome: FC<{ user: UserProfile }> = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    return (
        <header className="home-header">
            <div className="home-header-logo">
                <Snowflake size={32} color="#3b82f6" />
                <span>FrioFácil</span>
            </div>
            <div className="home-header-actions">
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
                            <a onClick={() => navigate("/minhaconta")} className="home-header-dropdown-item"><User size={16}/> Minha Conta</a>
                            <a onClick={() => handleLogout()} className="home-header-dropdown-item home-header-dropdown-item-danger"><LogOut size={16}/> Sair</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderHome