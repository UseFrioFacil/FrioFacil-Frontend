import type { FC } from 'react';
import { Snowflake, Home, SearchX } from 'lucide-react';

// Importe o arquivo CSS para aplicar os estilos
import './NotFoundPage.css';

const NotFoundPage: FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        
        <div className="not-found-icon-wrapper">
          <SearchX 
            className="not-found-icon" 
            strokeWidth={1.5} 
          />
        </div>

        <h1 className="error-code">
          404
        </h1>
        <h2 className="error-title">
          Página Não Encontrada
        </h2>
        <p className="error-description">
          Oops! Parece que o endereço que você digitou não existe ou foi movido.
        </p>

        <div className="action-button-wrapper">
          <a href="/" className="action-button">
            <Home className="action-button-icon" />
            <span>Voltar para o Início</span>
          </a>
        </div>
        
        <div className="footer-logo-wrapper">
            <a href="/" className="footer-logo">
                <Snowflake className="footer-logo-icon" />
                <span className="footer-logo-text">FrioFácil</span>
            </a>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
