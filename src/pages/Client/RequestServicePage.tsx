import { useState } from 'react';
import { Building, Home, Briefcase, Droplet, Thermometer, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
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
  propertyType: string;
  room: string;
  urgency: string;
}

export default function RequestServicePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    problemDescription: '',
    commonProblems: [],
    propertyType: '',
    room: '',
    urgency: '',
  });
  console.log(formData)

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

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
    handleNext();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormStep title="1. Qual é o problema?">
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">Selecione os problemas principais (opcional):</label>
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
                  placeholder="Ex: O ar condicionado parou de gelar ontem à noite e está fazendo um barulho alto no motor..."
                  value={formData.problemDescription}
                  onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                />
              </div>
            </div>
          </FormStep>
        );
      case 2:
        return (
          <FormStep title="2. Onde fica o equipamento?">
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">Tipo de imóvel:</label>
                <div className="problems-grid">
                  <ProblemTag label="Casa" icon={Home} isSelected={formData.propertyType === 'Casa'} onClick={() => setFormData({...formData, propertyType: 'Casa'})} />
                  <ProblemTag label="Apartamento" icon={Building} isSelected={formData.propertyType === 'Apartamento'} onClick={() => setFormData({...formData, propertyType: 'Apartamento'})} />
                  <ProblemTag label="Comercial" icon={Briefcase} isSelected={formData.propertyType === 'Comercial'} onClick={() => setFormData({...formData, propertyType: 'Comercial'})} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="room" className="form-label">Qual o cômodo?</label>
                <input
                  type="text"
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  placeholder="Ex: Quarto, Sala, Escritório..."
                  className="text-input"
                />
              </div>
            </div>
          </FormStep>
        );
      case 3:
        return (
          <FormStep title="3. Revise e envie sua solicitação">
            <div className="step-content">
              <div className="review-item">
                <h4 className="review-title">Problema:</h4>
                <p className="review-content">{formData.commonProblems.join(', ')}</p>
                <p className="review-content">{formData.problemDescription || "Nenhuma descrição adicional."}</p>
              </div>
              <div className="review-item">
                <h4 className="review-title">Local:</h4>
                <p className="review-content">{formData.propertyType}, no cômodo: {formData.room}</p>
              </div>
              <div className="review-note">
                Ao enviar, você concorda em compartilhar essas informações com <strong>{mockTechnician.name}</strong> para que ele possa entrar em contato e agendar uma visita.
              </div>
            </div>
          </FormStep>
        );
      case 4:
        return (
          <div className="success-container">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">Solicitação Enviada!</h2>
            <p className="success-message">
              Sua solicitação foi enviada com sucesso para <strong>{mockTechnician.name}</strong>. Ele(a) entrará em contato em breve para agendar a visita.
            </p>
            <a href="https://wa.me/5599999999999?text=Oi%2C+quero+mais+informações%21" className="success-button">
              Voltar para o WhatsApp
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <Header showOptions={false} showMenu={false}/>
      <main className="main-container">
        <div className="content-container">
          {step < 4 && <TechnicianInfoCard tech={mockTechnician} />}
          
          {renderStep()}

          {step < 3 && (
            <div className="navigation-buttons">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="back-button"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                className="next-button"
              >
                Avançar
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="navigation-buttons">
              <button
                onClick={handleBack}
                className="back-button"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                className="submit-button"
              >
                Enviar Solicitação
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}