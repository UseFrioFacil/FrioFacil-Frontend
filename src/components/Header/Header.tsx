import type { FC } from 'react';
import { useState } from 'react';
import { Snowflake, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeaderStyle.css'
import '../../styles/global.css'
import { useNavigate } from 'react-router-dom';

interface NavLink {
  name: string;
  href: string;
}

type HeaderProps = {
  showMenu?: boolean;
  showOptions?: boolean;
  showBackButton?: boolean;
};

const Header: FC<HeaderProps> = ({ showOptions = true, showMenu = true, showBackButton = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navLinks: NavLink[] = [
    { name: 'Recursos', href: '#features' },
    { name: 'Planos', href: '#pricing' },
    { name: 'Dúvidas', href: '#faq' },
  ];

  const navigate = useNavigate();

  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="header-container container">
        <motion.a 
          className="logo" 
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Snowflake className="logo-icon" />
          </motion.div>
          <span className="logo-text">FrioFácil</span>
        </motion.a>

        {/* Navegação central para Desktop */}
        {showOptions &&
        <motion.nav 
          className="nav-desktop"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {navLinks.map((link, index) => (
            <motion.a 
              key={link.name} 
              href={link.href} 
              className="nav-link"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              whileHover={{ y: -2, color: '#3b82f6' }}
              whileTap={{ scale: 0.95 }}
            >
              {link.name}
            </motion.a>
          ))}
        </motion.nav>}

        {/* 2. Container para os elementos do lado direito */}
        <div className="header-right-actions">
          {showBackButton ? (
            <motion.button 
              className="btn-voltar" 
              onClick={() => navigate(-1)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </motion.button>
          ) : (
            <>
              <motion.div 
                className="nav-desktop-actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <motion.a 
                  onClick={() => navigate("/login")} 
                  className="nav-link"
                  whileHover={{ y: -2, color: '#3b82f6' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Entrar
                </motion.a>
                <motion.a 
                  className="btn btn-primary" 
                  onClick={() => navigate("/cadastreempresa")}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Comece Grátis
                </motion.a>
              </motion.div>

              {showMenu && <motion.button
                className="mobile-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMenuOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMenuOpen ? <X /> : <Menu />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>}
            </>
          )}
        </div>
      </div>

      {/* Menu Mobile: só abre se o botão de voltar não estiver visível */}
      <AnimatePresence>
        {!showBackButton && isMenuOpen && (
          <motion.div 
            className="mobile-menu mobile-menu-open"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.nav 
              className="mobile-nav"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                  whileHover={{ x: 5, color: '#3b82f6' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div 
                className="mobile-nav-footer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <motion.a 
                  onClick={() => navigate("/login")} 
                  className="mobile-nav-link"
                  whileHover={{ x: 5, color: '#3b82f6' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Entrar
                </motion.a>
                <motion.a 
                  onClick={() => navigate("/cadastreempresa")} 
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Comece Grátis
                </motion.a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;