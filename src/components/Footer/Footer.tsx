import { Snowflake, } from 'lucide-react';
import "./FooterStyle.css"
import { useNavigate } from 'react-router-dom';


const Footer = () => {
    const navigate = useNavigate()

    return(
        <footer className="footer">
            <div className="container">
            <div className="footer-grid">
                <div>
                <a href="#" className="footer-logo">
                    <Snowflake className="footer-logo-icon" />
                    <span className="logo-text2">FrioFácil</span>
                </a>
                <p className="footer-description">
                    Transformando a gestão de empresas de climatização com tecnologia e simplicidade.
                </p>
                </div>
                <div>
                <h4 className="footer-title">Navegação</h4>
                <ul className="footer-links">
                    <li><a onClick={() => navigate("/")} className="footer-link">Recursos</a></li>
                    <li><a onClick={() => navigate("/")} className="footer-link">Planos</a></li>
                    <li><a onClick={() => navigate("/")} className="footer-link">Dúvidas</a></li>
                    <li><a onClick={() => navigate("/login")} className="footer-link">Entrar</a></li>
                </ul>
                </div>
                <div>
                <h4 className="footer-title">Legal</h4>
                <ul className="footer-links">
                    <li><a href="#" className="footer-link">Termos de Serviço</a></li>
                    <li><a href="#" className="footer-link">Política de Privacidade</a></li>
                </ul>
                </div>
            </div>
            <div className="footer-copyright">
                <p>&copy; {new Date().getFullYear()} FrioFácil. Todos os direitos reservados.</p>
            </div>
            </div>
      </footer>
    )
}

export default Footer