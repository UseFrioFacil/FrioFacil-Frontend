import { useState } from 'react';
import { Droplet, Thermometer, Zap, AlertTriangle, CheckCircle } from 'lucide-react'; 
import "./RequestServiceStyle.css"
import Header from '../../components/Header/Header'
import TechnicianInfoCard from './uiClient/TechnicianInfoCard'
import FormStep from './uiClient/FormStep.tsx'
import ProblemTag from './uiClient/ProblemTag.tsx'

const mockTechnician = {
  id: 1,
  name: 'Ciclo Frio',
  avatarUrl: 'https://placehold.co/100x100/E0F2FE/3B82F6?text=CF',
  location: 'Paulista, PE',
  rating: 4.8
};

interface FormData {
  problemDescription: string;
  commonProblems: string[];
  telefone: string;
  localizacao: string;
}

export default function RequestServicePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    problemDescription: '',
    commonProblems: [],
    telefone: '',
    localizacao: '',
  });
  console.log(formData)

  const handleProblemTagClick = (problem: string) => {
    setFormData(prev => {
      const newProblems = prev.commonProblems.includes(problem)
        ? prev.commonProblems.filter(p => p !== problem)
        : [...prev.commonProblems, problem];
      return { ...prev, commonProblems: newProblems };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado:", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="page-container">
        <Header showOptions={false} showMenu={false}/>
        <main className="main-container">
           <div className="success-container">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">Solicitação Enviada!</h2>
            <p className="success-message">
              Sua solicitação foi enviada com sucesso para <strong>{mockTechnician.name}</strong>. Ele(a) entrará em contato em breve para agendar a visita.
            </p>
            <a href="https://wa.me/5599999999999?text=Oi%2C+quero+mais+informações%21" className="success-button">
              Entrar em contato por WhatsApp
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header showOptions={false} showMenu={false}/>
      <main className="main-container">
        <div className="content-container">
          <TechnicianInfoCard tech={mockTechnician} />
          
          <form onSubmit={handleSubmit} className="single-form">
            
            {/* 1. Usando um único FormStep para todos os campos */}
            <FormStep title="Formulário de Solicitação">
              <div className="step-content">
                
                {/* Campos sobre o problema */}
                <div className="form-group">
                  <label className="form-label">Qual é o problema? (opcional)</label>
                  <div className="problems-grid">
                    <ProblemTag label="Não Gela" icon={Thermometer} isSelected={formData.commonProblems.includes('Não Gela')} onClick={() => handleProblemTagClick('Não Gela')} />
                    <ProblemTag label="Está Pingando" icon={Droplet} isSelected={formData.commonProblems.includes('Está Pingando')} onClick={() => handleProblemTagClick('Está Pingando')} />
                    <ProblemTag label="Não Liga" icon={Zap} isSelected={formData.commonProblems.includes('Não Liga')} onClick={() => handleProblemTagClick('Não Liga')} />
                    <ProblemTag label="Barulho Estranho" icon={AlertTriangle} isSelected={formData.commonProblems.includes('Barulho Estranho')} onClick={() => handleProblemTagClick('Barulho Estranho')} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Descreva com mais detalhes:
                  </label>
                  <textarea
                    id="description"
                    className="textarea"
                    placeholder="Ex: O ar parou de gelar e está fazendo um barulho alto..."
                    value={formData.problemDescription}
                    onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                    required
                  />
                </div>

                {/* Campos de informação do cliente */}
                <div className="form-group">
                  <label htmlFor="localizacao" className="form-label">Seu endereço completo:</label>
                  <input
                    type="text"
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
                    placeholder="Rua, Número, Bairro, Cidade"
                    className="text-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone" className="form-label">Seu telefone (WhatsApp):</label>
                  <input
                    type="tel"
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(99) 99999-9999"
                    className="text-input"
                    required
                  />
                </div>
              </div>
            </FormStep>

            <div className="review-note">
              Ao enviar, suas informações serão compartilhadas com <strong>{mockTechnician.name}</strong>.
            </div>

            <div className="navigation-buttons">
              <button
                type="submit"
                className="submit-button"
              >
                Enviar Solicitação
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}