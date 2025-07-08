import React, { useState } from 'react';
import type { FC } from 'react';
import { Building, ArrowRight, CheckCircle } from 'lucide-react';

// --- Estilos CSS (AcceptInvitePage.css) ---
import './InviteLinkStyle.css'

// --- Componente de Aceitar Convite ---
const AcceptInvitePage: FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Dados de exemplo
  const companyName = "Refrigeração Ártico";
  const userEmail = "voce@email.com";

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui iria a lógica de validação e envio para a API
    if (password && password === confirmPassword) {
      console.log("Registrando com a senha:", password);
      setIsSubmitted(true);
    } else {
      alert("As senhas não conferem ou estão em branco.");
    }
  };
  
  if (isSubmitted) {
    return (
        <div className="invite-container">
            <div className="invite-card success-message">
                <div className="invite-header">
                    <div className="invite-icon-wrapper success-icon-wrapper">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="invite-title">Tudo Certo!</h1>
                    <p className="invite-subtitle">
                        Sua conta foi criada com sucesso. Você foi adicionado à empresa <strong>{companyName}</strong>.
                    </p>
                </div>
                <button className="submit-button" onClick={() => window.location.href = '/dashboard'}>
                    Acessar o Painel
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="invite-container">
      <div className="invite-card">
        <div className="invite-header">
          <div className="invite-icon-wrapper">
            <Building size={32} />
          </div>
          <h1 className="invite-title">Você foi convidado!</h1>
          <p className="invite-subtitle">
            A empresa <strong>{companyName}</strong> convidou você para se juntar à equipe no FrioFácil.
          </p>
        </div>

        <form className="invite-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              value={userEmail}
              disabled 
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Crie sua senha</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <p className="password-requirements">Mínimo de 8 caracteres.</p>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirme sua senha</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="form-input" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="submit-button" disabled={!password || password !== confirmPassword}>
            Criar conta e aceitar convite
          </button>
        </form>
        
        <p className="terms-text">
            Ao se registrar, você concorda com nossos <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
};

// Componente App principal para renderização
export default function App() {
  const AppHeader = () => (
    <header style={{ padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', textAlign: 'center', fontWeight: 'bold', color: '#111827' }}>
      FrioFácil
    </header>
  );

  const AppFooter = () => (
    <footer style={{ padding: '20px', backgroundColor: '#111827', color: 'white', textAlign: 'center', fontSize: '14px' }}>
      © 2024 FrioFácil. Todos os direitos reservados.
    </footer>
  );

  return (
    <>
      <AppHeader />
      <AcceptInvitePage />
      <AppFooter />
    </>
  );
}
