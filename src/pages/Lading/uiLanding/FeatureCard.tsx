import type { FC, ReactNode, ElementType } from 'react';
import FeatureIcon from "./FeatureIcon"

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
  color: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, children, color }) => (
  <div className="feature-card">
    <div className="feature-header">
      <FeatureIcon icon={Icon} color={color} />
      <h3 className="feature-title">{title}</h3>
    </div>
    <p className="feature-description">{children}</p>
  </div>
);

export default FeatureCard