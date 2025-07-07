import React, { useState } from 'react';
import type { FC } from 'react';
import { Building, ArrowRight, CheckCircle } from 'lucide-react';

// --- Estilos CSS (AcceptInvitePage.css) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  body {
    background-color: #f0f9ff;
    font-family: 'Inter', sans-serif;
    color: #374151;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  #root {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .invite-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .invite-card {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 480px;
    text-align: center;
  }
  
  @media (min-width: 520px) {
      .invite-card {
          padding: 48px;
      }
  }

  .invite-header {
    margin-bottom: 24px;
  }
  
  .invite-icon-wrapper {
      background-color: #e0f2fe;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      color: #0284c7;
  }

  .invite-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  .invite-subtitle {
    font-size: 16px;
    color: #4b5563;
    line-height: 1.6;
  }
  
  .invite-subtitle strong {
    color: #111827;
    font-weight: 600;
  }

  /* --- Formulário --- */
  .invite-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 32px;
    text-align: left;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
  
  .password-requirements {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
  }

  /* --- Botão e Termos --- */
  .submit-button {
    width: 100%;
    background-color: #3b82f6;
    color: white;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }

  .submit-button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
  }
  
  .submit-button:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
  }

  .terms-text {
    margin-top: 24px;
    font-size: 12px;
    color: #6b7280;
  }
  
  .terms-text a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
  }
  
  .terms-text a:hover {
      text-decoration: underline;
  }
  
  /* --- Tela de Sucesso --- */
  .success-message {
      animation: fadeIn 0.5s ease-out;
  }
  
  .success-icon-wrapper {
      background-color: #dcfce7;
      color: #22c55e;
  }
`;

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
      <style>{styles}</style>
      <AppHeader />
      <AcceptInvitePage />
      <AppFooter />
    </>
  );
}
