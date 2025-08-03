import type { FC, ReactNode, ElementType } from 'react';
import { motion } from 'framer-motion';
import FeatureIcon from "./FeatureIcon"

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
  color: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, children, color }) => (
  <motion.div 
    className="feature-card"
    whileHover={{ 
      y: -8, 
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }}
  >
    <motion.div 
      className="feature-header"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.3, 
          duration: 0.5,
          type: "spring",
          stiffness: 200 
        }}
      >
        <FeatureIcon icon={Icon} color={color} />
      </motion.div>
      <motion.h3 
        className="feature-title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {title}
      </motion.h3>
    </motion.div>
    <motion.p 
      className="feature-description"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      {children}
    </motion.p>
  </motion.div>
);

export default FeatureCard