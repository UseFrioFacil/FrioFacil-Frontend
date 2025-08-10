import type { FC } from 'react';
import { useState } from 'react';
import {
    Snowflake,
    ChevronDown,
    LogOut,
    User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.header 
            className="home-header"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div 
                className="home-header-logo"
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <motion.div
                    animate={{ 
                        rotate: 360,
                        y: [0, -2, 0]
                    }}
                    transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    whileHover={{ 
                        scale: 1.1,
                        rotate: 0,
                        transition: { duration: 0.3 }
                    }}
                >
                    <Snowflake size={32} className="home-logo-icon" />
                </motion.div>
                <span>FrioFácil</span>
            </motion.div>
            
            <div className="home-header-actions">
                <div className="home-header-user-menu-container">
                    <button 
                        className="home-header-user-menu-button" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <img src={user.avatarUrl} alt={user.name} className="home-header-avatar" />
                        <span className="home-header-user-name">{user.name}</span>
                        <ChevronDown size={20} className={`home-header-chevron-icon ${isMenuOpen ? 'open' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div 
                                className="home-header-dropdown-menu"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="home-header-dropdown-user-info">
                                    <p className="home-header-dropdown-user-name">{user.name}</p>
                                    <p className="home-header-dropdown-user-email">{user.email}</p>
                                </div>
                                <motion.a 
                                    onClick={() => navigate("/minhaconta")} 
                                    className="home-header-dropdown-item"
                                    whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <User size={16}/> Minha Conta
                                </motion.a>
                                <motion.a 
                                    onClick={() => handleLogout()} 
                                    className="home-header-dropdown-item home-header-dropdown-item-danger"
                                    whileHover={{ x: 5, backgroundColor: "#fef2f2" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <LogOut size={16}/> Sair
                                </motion.a>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
};

export default HeaderHome;