import type { FC } from 'react';
import { useState } from 'react';
import { Snowflake, Menu, X } from 'lucide-react';
import './HeaderStyle.css'
import '../../styles/global.css'
import { useNavigate } from 'react-router-dom';


interface NavLink {
  name: string;
  href: string;
}

type HeaderProps = {
  showMenu:boolean;
  showOptions:boolean;
};
const Header: FC<HeaderProps> = ({ showOptions, showMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navLinks: NavLink[] = [
    { name: 'Recursos', href: '#features' },
    { name: 'Planos', href: '#pricing' },
    { name: 'Dúvidas', href: '#faq' },
  ];

  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container container">
        <a className="logo" onClick={() => navigate("/")}>
          <Snowflake className="logo-icon" />
          <span className="logo-text">FrioFácil</span>
        </a>

        {/* Navegação para Desktop */}
        {showOptions && 
        <nav className="nav-desktop">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </nav>}

        <div className="nav-desktop">
          <a onClick={() => navigate("/login")} className="nav-link">Entrar</a>
          <a className="btn btn-primary" onClick={() => navigate("/cadastreempresa")}>Comece Grátis</a>
        </div>

        {/* Botão do Menu Mobile */}
        {showMenu && <button 
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>}
      </div>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
        <nav className="mobile-nav">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className="mobile-nav-link" 
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="mobile-nav-footer">
            <a onClick={() => navigate("/login")} className="mobile-nav-link">Entrar</a>
            <a onClick={() => navigate("/cadastreempresa")} className="btn btn-primary">Comece Grátis</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header