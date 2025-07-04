import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface PricingCardProps {
  plan: string;
  price: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const PricingCard: FC<PricingCardProps> = ({ plan, price, features, cta, popular = false }) => {
  
  const navigate = useNavigate()
  
  return(
  <div className={`pricing-card ${popular ? 'pricing-card-popular' : ''}`}>
    {popular && (
      <div className="popular-badge">Mais Popular</div>
    )}
    <h3 className="pricing-plan">{plan}</h3>
    <p className="pricing-price">
      R${price}
      <span className="pricing-period">/mês</span>
    </p>
    <p className="pricing-description">
      {plan === 'Básico' ? 'Ideal para autônomos e pequenas equipes.' : 
       plan === 'Profissional' ? 'Para empresas em crescimento.' : 
       'Soluções avançadas para grandes operações.'}
    </p>
    <ul className="pricing-features">
      {features.map((feature, index) => (
        <li key={index} className="pricing-feature">
          <div className="feature-check">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button onClick={() => navigate("/cadastro")} className={`pricing-button ${popular ? 'pricing-button-popular' : 'pricing-button-regular'}`}>
      {cta}
    </button>
  </div>
)};

export default PricingCard