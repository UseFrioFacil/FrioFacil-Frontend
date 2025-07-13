import type { FC } from 'react';
import { useState } from 'react';
import { Snowflake, Menu, X, ArrowLeft } from 'lucide-react';
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
    <header className="header">
      <div className="header-container container">
        <a className="logo" onClick={() => navigate('/')}>
          <Snowflake className="logo-icon" />
          <span className="logo-text">FrioFácil</span>
        </a>

        {/* Navegação central para Desktop */}
        {showOptions &&
        <nav className="nav-desktop">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </nav>}

        {/* 2. Container para os elementos do lado direito */}
        <div className="header-right-actions">
          {showBackButton ? (
            <button className="btn-voltar" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </button>
          ) : (
            <>
              <div className="nav-desktop-actions">
                <a onClick={() => navigate("/login")} className="nav-link">Entrar</a>
                <a className="btn btn-primary" onClick={() => navigate("/cadastreempresa")}>Comece Grátis</a>
              </div>

              {showMenu && <button
                className="mobile-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>}
            </>
          )}
        </div>
      </div>

      {/* Menu Mobile: só abre se o botão de voltar não estiver visível */}
      {!showBackButton && (
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
      )}
    </header>
  );
};

export default Header;