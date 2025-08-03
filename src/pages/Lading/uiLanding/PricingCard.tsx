import type { FC } from 'react';
import { motion } from 'framer-motion';
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
  <motion.div 
    className={`pricing-card ${popular ? 'pricing-card-popular' : ''}`}
    whileHover={{ 
      y: -10, 
      scale: 1.02,
      boxShadow: popular 
        ? "0 25px 50px rgba(59, 130, 246, 0.25)" 
        : "0 25px 50px rgba(0, 0, 0, 0.15)"
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }}
  >
    {popular && (
      <motion.div 
        className="popular-badge"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Mais Popular
      </motion.div>
    )}
    <motion.h3 
      className="pricing-plan"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      {plan}
    </motion.h3>
    <motion.p 
      className="pricing-price"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
    >
      R${price}
      <span className="pricing-period">/mês</span>
    </motion.p>
    <motion.p 
      className="pricing-description"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {plan === 'Básico' ? 'Ideal para autônomos e pequenas equipes.' : 
       plan === 'Profissional' ? 'Para empresas em crescimento.' : 
       'Soluções avançadas para grandes operações.'}
    </motion.p>
    <motion.ul 
      className="pricing-features"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      {features.map((feature, index) => (
        <motion.li 
          key={index} 
          className="pricing-feature"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
        >
          <motion.div 
            className="feature-check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.3, type: "spring" }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </motion.div>
          <span>{feature}</span>
        </motion.li>
      ))}
    </motion.ul>
    <motion.button 
      onClick={() => navigate("/cadastro")} 
      className={`pricing-button ${popular ? 'pricing-button-popular' : 'pricing-button-regular'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: popular 
          ? "0 8px 25px rgba(59, 130, 246, 0.4)" 
          : "0 8px 25px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ scale: 0.95 }}
    >
      {cta}
    </motion.button>
  </motion.div>
)};

export default PricingCard