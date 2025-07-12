import { CheckCircle } from 'lucide-react';
import { plans } from "../Payment"


const PlanSelector = ({ onSelectPlan, companyTempId }: { onSelectPlan: (plan: typeof plans[0]) => void, companyTempId?: string | null }) => {
  return (
    <div className="plans-container">
      <h2>Escolha seu plano</h2>
      <p className="plans-subtitle">Assinatura mensal - cancele quando quiser</p>
      
      {companyTempId && (
        <div className="company-notice">
          <p>Você está criando uma empresa. Após o pagamento, sua empresa será ativada automaticamente.</p>
        </div>
      )}
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card" onClick={() => onSelectPlan(plan)}>
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="price">R$ {plan.price.toFixed(2)}</span>
              <span className="period">/mês</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <CheckCircle size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="select-plan-btn">
              Assinar {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelector